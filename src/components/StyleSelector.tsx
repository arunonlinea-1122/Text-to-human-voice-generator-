import React, { useState } from 'react';
import { STYLES, VOCAL_TAGS } from '../constants/presets';
import { Sparkles, SlidersHorizontal, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  customStylePrompt: string;
  onChangeCustomPrompt: (prompt: string) => void;
  onInsertTag: (tag: string) => void;
  isNepaliUi: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  customStylePrompt,
  onChangeCustomPrompt,
  onInsertTag,
  isNepaliUi,
}) => {
  const [showCustomDetails, setShowCustomDetails] = useState<boolean>(false);

  return (
    <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
      {/* Emotion / Tone Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isNepaliUi ? 'बोल्ने भाव र शैली (Speaking Emotion & Style):' : 'Tone & Style:'}</span>
          </label>
          <span className="text-xs text-slate-400">
            {isNepaliUi ? 'मानवीय भावनाहरू' : 'Emotional Nuances'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STYLES.map((st) => {
            const isSelected = selectedStyle === st.id;
            return (
              <button
                type="button"
                key={st.id}
                onClick={() => onSelectStyle(st.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="font-semibold mb-0.5">{isNepaliUi ? st.labelNe : st.labelEn}</div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {isNepaliUi ? st.descriptionNe : st.descriptionEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Human Vocal Bursts & Backchannel chips */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <span>{isNepaliUi ? 'प्राकृतिक मानवीय ट्यागहरू थप्नुहोस् (Add Human Vocal Bursts):' : 'Add Human Vocal Tags:'}</span>
          </span>
          <span className="text-[11px] text-indigo-400">
            {isNepaliUi ? 'पाठ जहाँ क्लिक गर्नुहुन्छ त्यहीं थपिन्छ' : 'Click to insert tag'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {VOCAL_TAGS.map((vt) => (
            <button
              key={vt.tag}
              type="button"
              onClick={() => onInsertTag(vt.tag)}
              title={vt.desc}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/20 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3 text-indigo-400 group-hover:text-white" />
              <span>{vt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Director Style Prompt (Advanced) */}
      <div className="pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => setShowCustomDetails(!showCustomDetails)}
          className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 transition py-1"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {isNepaliUi
                ? 'विस्तृत निर्देशन वा आफ्नै शैली लेख्नुहोस् (Custom Persona Prompt)'
                : 'Advanced Voice Direction / Custom Prompt'}
            </span>
          </span>
          {showCustomDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCustomDetails && (
          <div className="mt-2.5 space-y-1.5">
            <input
              type="text"
              value={customStylePrompt}
              onChange={(e) => onChangeCustomPrompt(e.target.value)}
              placeholder={
                isNepaliUi
                  ? 'उदा: एकदमै मायालु आमाको जस्तो न्यानो स्वर, बीच बीचमा हल्का हाँसो सहित...'
                  : 'e.g., A warm maternal Nepali elder tone with gentle smiling inflections...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isNepaliUi
                ? 'Gemini 3.8 Flash TTS ले तपाईंले दिएको विस्तृत निर्देशनअनुसार वास्तविक मान्छेको जस्तै उच्चारण गर्दछ।'
                : 'Gemini 3.8 Flash TTS dynamically directs the voice persona based on this prompt.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
