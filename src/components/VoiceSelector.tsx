import React from 'react';
import { VOICES } from '../constants/presets';
import { VoiceOption } from '../types';
import { User, Volume2 } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  isNepaliUi: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  isNepaliUi,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>{isNepaliUi ? 'मानवीय आवाज छान्नुहोस् (Select Human Voice):' : 'Select Human Voice:'}</span>
        </label>
        <span className="text-xs text-slate-400">
          {VOICES.length} {isNepaliUi ? 'विभिन्न स्वरहरू उपलब्ध' : 'voices available'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VOICES.map((v: VoiceOption) => {
          const isSelected = selectedVoice === v.id;
          return (
            <button
              type="button"
              key={v.id}
              onClick={() => onSelectVoice(v.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              {/* Selected indicator corner bar */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                  <div className="bg-indigo-500 text-white transform rotate-45 translate-x-3 -translate-y-3 text-[9px] font-bold py-0.5 text-center w-16">
                    ✓
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      v.gender === 'female'
                        ? 'bg-pink-500/15 text-pink-400 border border-pink-500/20'
                        : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {v.gender === 'female' ? '♀' : '♂'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition">
                      {isNepaliUi ? v.nepaliTitle : v.englishTitle}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {isNepaliUi ? v.descriptionNe : v.descriptionEn}
              </p>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/60">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${v.tagColor}`}>
                  {v.tag}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 group-hover:text-indigo-400 transition">
                  <Volume2 className="w-3 h-3" />
                  <span>{v.name}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
