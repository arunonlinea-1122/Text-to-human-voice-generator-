import React, { useState } from 'react';
import { VOICES } from '../constants/presets';
import { Users, Plus, Trash2, Sparkles, MessageSquare } from 'lucide-react';

interface DialogueModeProps {
  onGenerateDialogue: (speaker1: any, speaker2: any, dialogueParts: any[]) => void;
  isLoading: boolean;
  isNepaliUi: boolean;
}

export const DialogueMode: React.FC<DialogueModeProps> = ({
  onGenerateDialogue,
  isLoading,
  isNepaliUi,
}) => {
  const [speaker1, setSpeaker1] = useState({
    name: 'समीर (Samir)',
    voice: 'Puck',
    style: 'Natural conversational male with friendly tone',
  });

  const [speaker2, setSpeaker2] = useState({
    name: 'प्रिया (Priya)',
    voice: 'Kore',
    style: 'Warm, thoughtful, articulate female podcast co-host',
  });

  const [lines, setLines] = useState<Array<{ id: string; speakerName: string; text: string }>>([
    {
      id: '1',
      speakerName: 'समीर (Samir)',
      text: 'नमस्ते प्रिया! <breath> आजको हाम्रो पोडकास्टमा तपाईंलाई स्वागत छ।',
    },
    {
      id: '2',
      speakerName: 'प्रिया (Priya)',
      text: 'धन्यवाद समीर, |yeah| आज हामी नयाँ जेनेरेसनको एआई प्रविधिको बारेमा कुरा गर्दैछौं, होइन त?',
    },
    {
      id: '3',
      speakerName: 'समीर (Samir)',
      text: 'एकदम ठिक भन्नुभयो! <laugh> अब कम्प्युटरले पनि मान्छेले जस्तै प्राकृतिक रूपमा बोल्न थालिसक्यो।',
    },
  ]);

  const addLine = () => {
    const nextSpeaker = lines.length % 2 === 0 ? speaker1.name : speaker2.name;
    setLines([
      ...lines,
      {
        id: String(Date.now()),
        speakerName: nextSpeaker,
        text: '',
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 1) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, text: string) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const switchSpeaker = (id: string) => {
    setLines(
      lines.map((l) => {
        if (l.id === id) {
          const nextName = l.speakerName === speaker1.name ? speaker2.name : speaker1.name;
          return { ...l, speakerName: nextName };
        }
        return l;
      })
    );
  };

  const handleGenerate = () => {
    const validLines = lines.filter((l) => l.text.trim().length > 0);
    if (validLines.length === 0) return;

    const sp1Lines = validLines.filter((l) => l.speakerName === speaker1.name).map((l) => l.text);
    const sp2Lines = validLines.filter((l) => l.speakerName === speaker2.name).map((l) => l.text);

    const dialogueSpeakers = [
      {
        name: speaker1.name,
        voice: speaker1.voice,
        style: speaker1.style,
        lines: sp1Lines,
      },
      {
        name: speaker2.name,
        voice: speaker2.voice,
        style: speaker2.style,
        lines: sp2Lines,
      },
    ];

    onGenerateDialogue(speaker1, speaker2, dialogueSpeakers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              {isNepaliUi
                ? 'दोहोरो संवाद / पोडकास्ट मोड (2-Speaker Dialogue)'
                : 'Dual-Speaker Dialogue / Screenplay'}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Gemini 3.8 Flash TTS
          </span>
        </div>

        {/* Configure Two Speakers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Speaker 1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {isNepaliUi ? 'वक्ता १ (Speaker 1)' : 'Speaker 1'}
              </span>
              <span className="text-[11px] text-slate-400">
                {VOICES.find((v) => v.id === speaker1.voice)?.englishTitle}
              </span>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isNepaliUi ? 'नाम (Name)' : 'Name'}
              </label>
              <input
                type="text"
                value={speaker1.name}
                onChange={(e) => setSpeaker1({ ...speaker1, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isNepaliUi ? 'आवाज (Voice)' : 'Voice'}
              </label>
              <select
                value={speaker1.voice}
                onChange={(e) => setSpeaker1({ ...speaker1, voice: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.gender === 'female' ? 'Female' : 'Male'}) - {v.nepaliTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speaker 2 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                {isNepaliUi ? 'वक्ता २ (Speaker 2)' : 'Speaker 2'}
              </span>
              <span className="text-[11px] text-slate-400">
                {VOICES.find((v) => v.id === speaker2.voice)?.englishTitle}
              </span>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isNepaliUi ? 'नाम (Name)' : 'Name'}
              </label>
              <input
                type="text"
                value={speaker2.name}
                onChange={(e) => setSpeaker2({ ...speaker2, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isNepaliUi ? 'आवाज (Voice)' : 'Voice'}
              </label>
              <select
                value={speaker2.voice}
                onChange={(e) => setSpeaker2({ ...speaker2, voice: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.gender === 'female' ? 'Female' : 'Male'}) - {v.nepaliTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dialogue Lines script */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isNepaliUi ? 'संवादका वाक्यहरू (Dialogue Lines):' : 'Dialogue Script:'}</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {isNepaliUi ? 'वक्ता परिवर्तन गर्न नाममा क्लिक गर्नुहोस्' : 'Click name to switch speaker'}
            </span>
          </div>

          {lines.map((line, idx) => {
            const isSp1 = line.speakerName === speaker1.name;
            return (
              <div
                key={line.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                  isSp1
                    ? 'bg-indigo-950/20 border-indigo-500/20'
                    : 'bg-purple-950/20 border-purple-500/20'
                }`}
              >
                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                  <button
                    type="button"
                    onClick={() => switchSpeaker(line.id)}
                    title={isNepaliUi ? 'वक्ता परिवर्तन गर्नुहोस्' : 'Switch Speaker'}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition w-full text-center truncate ${
                      isSp1
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                    }`}
                  >
                    {line.speakerName}
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                </div>

                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={line.text}
                    onChange={(e) => updateLine(line.id, e.target.value)}
                    placeholder={
                      isNepaliUi
                        ? `${line.speakerName} ले बोल्ने कुरा लेख्नुहोस्...`
                        : `Line spoken by ${line.speakerName}...`
                    }
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>

                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title={isNepaliUi ? 'हटाउनुहोस्' : 'Remove Line'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addLine}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-xs text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/5 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isNepaliUi ? 'नयाँ वाक्य थप्नुहोस् (Add Next Line)' : 'Add Next Line'}</span>
          </button>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || lines.every((l) => !l.text.trim())}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isNepaliUi ? 'संवादको आवाज बन्दैछ...' : 'Synthesizing Dialogue Audio...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isNepaliUi
                  ? 'दुई वक्ताको वास्तविक संवाद अडियो बनाउनुहोस्'
                  : 'Generate Dual-Speaker Conversation'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
