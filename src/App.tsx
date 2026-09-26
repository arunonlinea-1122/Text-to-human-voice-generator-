/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  Volume2,
  Wand2,
  RotateCcw,
  Languages,
  Layers,
  Users,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Music2,
  Info,
} from 'lucide-react';
import { VoiceSelector } from './components/VoiceSelector';
import { StyleSelector } from './components/StyleSelector';
import { AudioWaveform } from './components/AudioWaveform';
import { DialogueMode } from './components/DialogueMode';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SAMPLE_TEXTS, STYLES, VOICES } from './constants/presets';
import { GeneratedClip, LanguageKey } from './types';

const STORAGE_KEY = 'dhvani_ai_clips_history_v1';

export default function App() {
  // App UI language: true = Nepali, false = English
  const [isNepaliUi, setIsNepaliUi] = useState<boolean>(true);

  // Active Tab: 'single' | 'dialogue' | 'history'
  const [activeTab, setActiveTab] = useState<'single' | 'dialogue' | 'history'>('single');

  // Single Voice State
  const [targetLang, setTargetLang] = useState<LanguageKey>('ne');
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [selectedStyle, setSelectedStyle] = useState<string>('natural');
  const [customStylePrompt, setCustomStylePrompt] = useState<string>('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current Generated Audio
  const [currentClip, setCurrentClip] = useState<GeneratedClip | null>(null);
  // History of generated clips
  const [historyClips, setHistoryClips] = useState<GeneratedClip[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistoryClips(parsed);
          if (parsed.length > 0) {
            setCurrentClip(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load history clips:', e);
    }
  }, []);

  // Save history to localStorage
  const saveClipToHistory = (clip: GeneratedClip) => {
    const updated = [clip, ...historyClips.filter((c) => c.id !== clip.id)].slice(0, 20);
    setHistoryClips(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded, could not save all clips:', e);
    }
  };

  const handleDeleteClip = (id: string) => {
    const updated = historyClips.filter((c) => c.id !== id);
    setHistoryClips(updated);
    if (currentClip?.id === id) {
      setCurrentClip(updated[0] || null);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistoryClips([]);
    setCurrentClip(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Insert tag (like <breath>, <laugh>) at current cursor position
  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current) {
      setInputText((prev) => `${prev} ${tag}`);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = inputText;
    const newText = text.substring(0, start) + ` ${tag} ` + text.substring(end);
    setInputText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + tag.length + 2, start + tag.length + 2);
      }
    }, 50);
  };

  // AI Humanizer: inserts natural breath pauses, realistic flow
  const handleHumanizeText = async () => {
    if (!inputText.trim()) return;
    setIsHumanizing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/tts/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          language: targetLang,
          style: selectedStyle,
        }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setInputText(data.enhancedText);
      }
    } catch (err: any) {
      console.error('Humanize error:', err);
      setErrorMessage(
        isNepaliUi
          ? 'पाठ परिमार्जन गर्न सकिएन, तर तपाईं सिधै आवाज बनाउन सक्नुहुन्छ।'
          : 'Could not auto-humanize, but you can synthesize directly.'
      );
    } finally {
      setIsHumanizing(false);
    }
  };

  // Generate Single Voice Speech
  const handleGenerateSpeech = async () => {
    if (!inputText.trim()) {
      setErrorMessage(
        isNepaliUi ? 'कृपया आवाजमा रूपान्तरण गर्न केही पाठ लेख्नुहोस्।' : 'Please enter some text to speak.'
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          language: targetLang,
          voice: selectedVoice,
          style: selectedStyle,
          customStylePrompt: customStylePrompt,
          isDialogue: false,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to synthesize speech');
      }

      const styleObj = STYLES.find((s) => s.id === selectedStyle);
      const newClip: GeneratedClip = {
        id: String(Date.now()),
        text: inputText,
        voice: selectedVoice,
        style: isNepaliUi ? styleObj?.labelNe || selectedStyle : styleObj?.labelEn || selectedStyle,
        language: targetLang,
        audioUrl: data.audioUrl,
        audioBase64: data.audioBase64,
        durationEstimated: data.durationEstimated || 0,
        timestamp: Date.now(),
        isDialogue: false,
      };

      setCurrentClip(newClip);
      saveClipToHistory(newClip);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(
        err.message ||
          (isNepaliUi
            ? 'आवाज उत्पादन गर्न समस्या भयो। कृपया पाठ जाँच गरी पुन: प्रयास गर्नुहोस्।'
            : 'Error synthesizing speech. Please check your text and try again.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Dual-Speaker Dialogue Speech
  const handleGenerateDialogue = async (speaker1: any, speaker2: any, dialogueSpeakers: any[]) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDialogue: true,
          dialogueSpeakers,
          language: targetLang,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate dialogue');
      }

      const combinedText = dialogueSpeakers
        .map((s: any) => `${s.name}: ${s.lines.join(' ')}`)
        .join('\n');

      const newClip: GeneratedClip = {
        id: String(Date.now()),
        text: combinedText,
        voice: `${speaker1.voice} & ${speaker2.voice}`,
        style: isNepaliUi ? 'दोहोरो संवाद (Dialogue)' : 'Dual Speaker Dialogue',
        language: targetLang,
        audioUrl: data.audioUrl,
        audioBase64: data.audioBase64,
        durationEstimated: data.durationEstimated || 0,
        timestamp: Date.now(),
        isDialogue: true,
      };

      setCurrentClip(newClip);
      saveClipToHistory(newClip);
      setActiveTab('single'); // Switch to main tab to view the player
    } catch (err: any) {
      console.error('Dialogue error:', err);
      setErrorMessage(
        err.message ||
          (isNepaliUi
            ? 'संवाद अडियो उत्पादन गर्न सकिएन। कृपया संवादका वाक्यहरू जाँच गर्नुहोस्।'
            : 'Failed to generate dialogue audio. Please check your script.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter sample texts based on chosen language
  const filteredSamples = SAMPLE_TEXTS.filter(
    (s) => targetLang === 'auto' || s.lang === targetLang
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  {isNepaliUi ? 'ध्वनि एआई (Dhvani AI)' : 'Dhvani AI Voice Studio'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Gemini 3.8 Flash TTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isNepaliUi
                  ? 'नेपाली, हिन्दी र अंग्रेजीमा मान्छेकै जस्तो १००% वास्तविक मानवीय आवाज'
                  : 'Ultra-realistic human voice synthesis for Nepali, Hindi, English & all languages'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* UI Language Switcher */}
            <button
              onClick={() => setIsNepaliUi(!isNepaliUi)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="Switch Interface Language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isNepaliUi ? 'English' : 'नेपाली'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isNepaliUi ? 'एकल मानव स्वर (Single Voice)' : 'Single Speaker'}</span>
            </button>

            <button
              onClick={() => setActiveTab('dialogue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'dialogue'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isNepaliUi ? 'दोहोरो संवाद (Dialogue/Podcast)' : 'Dual Speaker Dialogue'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isNepaliUi ? 'इतिहास (Saved)' : 'Saved Clips'}</span>
              {historyClips.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-[10px] flex items-center justify-center">
                  {historyClips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{isNepaliUi ? 'त्रुटि:' : 'Error:'} </span>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Audio Waveform Player (Visible when clip exists) */}
        {currentClip && (
          <div className="animate-in fade-in duration-300">
            <AudioWaveform
              audioUrl={currentClip.audioUrl}
              voiceName={currentClip.voice}
              styleName={currentClip.style}
              textSnippet={currentClip.text}
              isNepaliUi={isNepaliUi}
            />
          </div>
        )}

        {/* Tab 1: Single Speaker Studio */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            {/* Input Card */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
              {/* Language selection pills & Sample Prompts */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
                    <Languages className="w-3 h-3 text-indigo-400" />
                    <span>{isNepaliUi ? 'भाषा:' : 'Language:'}</span>
                  </span>
                  {[
                    { key: 'ne', label: 'नेपाली (Nepali)' },
                    { key: 'hi', label: 'हिन्दी (Hindi)' },
                    { key: 'en', label: 'English' },
                    { key: 'auto', label: isNepaliUi ? 'कुनै पनि भाषा' : 'Any / Auto' },
                  ].map((l) => (
                    <button
                      key={l.key}
                      onClick={() => setTargetLang(l.key as LanguageKey)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                        targetLang === l.key
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                {/* Humanize button with Gemini */}
                <button
                  type="button"
                  onClick={handleHumanizeText}
                  disabled={isHumanizing || !inputText.trim()}
                  title={
                    isNepaliUi
                      ? 'पाठलाई स्वाभाविक मान्छेले बोलेजस्तै बनाउन सास फेर्ने र उपयुक्त विश्राम चिन्ह थप्नुहोस्'
                      : 'Auto-insert natural pauses, commas and realistic breathing tags'
                  }
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {isHumanizing ? (
                    <div className="w-3.5 h-3.5 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>
                    {isNepaliUi
                      ? 'मानव स्पर्श थप्नुहोस् (Humanize Flow)'
                      : 'Enhance Human Pauses'}
                  </span>
                </button>
              </div>

              {/* Sample Texts Selector */}
              {filteredSamples.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-medium text-slate-500 shrink-0">
                    {isNepaliUi ? 'नमुना पाठहरू:' : 'Quick Presets:'}
                  </span>
                  {filteredSamples.map((samp) => (
                    <button
                      key={samp.id}
                      type="button"
                      onClick={() => {
                        setInputText(samp.text);
                        setSelectedVoice(samp.recommendedVoice);
                        setSelectedStyle(samp.recommendedStyle);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 shrink-0 hover:border-indigo-500/50 transition cursor-pointer"
                    >
                      {samp.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isNepaliUi
                      ? 'यहाँ नेपाली, हिन्दी वा अंग्रेजीमा जे पनि लेख्नुहोस्... (उदा: नमस्ते, म आज तपाईंलाई नयाँ प्रविधिको बारेमा बताउँदैछु...)'
                      : 'Type or paste any text in Nepali, Hindi, English, or any language...'
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed resize-y min-h-[120px]"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 px-1">
                  <span>
                    {isNepaliUi
                      ? 'टिप: <breath> ट्यागले बोल्दा मान्छेले सास तानेको जस्तो आवाज दिन्छ।'
                      : 'Tip: <breath> creates natural vocal breathing, <laugh> adds a smile.'}
                  </span>
                  <span>
                    {inputText.length} {isNepaliUi ? 'अक्षर' : 'chars'} | {inputText.split(/\s+/).filter(Boolean).length}{' '}
                    {isNepaliUi ? 'शब्द' : 'words'}
                  </span>
                </div>
              </div>

              {/* Voice Picker */}
              <VoiceSelector
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                isNepaliUi={isNepaliUi}
              />

              {/* Emotion / Style & Vocal Bursts */}
              <StyleSelector
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
                customStylePrompt={customStylePrompt}
                onChangeCustomPrompt={setCustomStylePrompt}
                onInsertTag={handleInsertTag}
                isNepaliUi={isNepaliUi}
              />

              {/* Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateSpeech}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:via-indigo-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {isNepaliUi
                          ? 'मानव आवाज उत्पादन हुँदैछ (Gemini 3.8 Flash TTS)...'
                          : 'Synthesizing Realistic Human Voice...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>
                        {isNepaliUi
                          ? 'मानव आवाजमा रूपान्तरण गर्नुहोस् (Generate Human Speech)'
                          : 'Synthesize Human-Like Speech'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dialogue / Screenplay Mode */}
        {activeTab === 'dialogue' && (
          <DialogueMode
            onGenerateDialogue={handleGenerateDialogue}
            isLoading={isGenerating}
            isNepaliUi={isNepaliUi}
          />
        )}

        {/* Tab 3: History Drawer */}
        {activeTab === 'history' && (
          <HistoryDrawer
            clips={historyClips}
            onSelectClip={setCurrentClip}
            onDeleteClip={handleDeleteClip}
            onClearAll={handleClearHistory}
            currentClipId={currentClip?.id}
            isNepaliUi={isNepaliUi}
          />
        )}

        {/* Features & Help Info Banner */}
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              {isNepaliUi
                ? 'Gemini 3.8 Flash TTS मोडलले नेपाली, हिन्दी र अंग्रेजी भाषामा स्वाभाविक उच्चारण, भावना, र विश्राम सहित मान्छेकै जस्तो आवाज निकाल्दछ।'
                : 'Powered by Gemini 3.8 Flash TTS with support for rich phonetics, emotions, breaths, and dialogues.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
              24 kHz Studio Audio
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px] font-mono">
              RIFF WAV Format
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
