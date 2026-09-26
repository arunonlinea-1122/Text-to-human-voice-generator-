import React from 'react';
import { GeneratedClip } from '../types';
import { Clock, Play, Download, Trash2, Volume2, Sparkles } from 'lucide-react';

interface HistoryDrawerProps {
  clips: GeneratedClip[];
  onSelectClip: (clip: GeneratedClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
  currentClipId?: string;
  isNepaliUi: boolean;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  clips,
  onSelectClip,
  onDeleteClip,
  onClearAll,
  currentClipId,
  isNepaliUi,
}) => {
  if (clips.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-500">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
        <p className="text-xs">
          {isNepaliUi
            ? 'अहिलेसम्म कुनै अडियो रेकर्ड छैन। नयाँ आवाज बनाएपछि यहाँ सुरक्षित हुनेछ।'
            : 'No generated clips yet. Synthesized voices will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {isNepaliUi ? 'पछिल्लो अडियो इतिहास (Saved Clips):' : 'Generated Voice History:'}
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {clips.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] text-slate-500 hover:text-rose-400 transition"
        >
          {isNepaliUi ? 'सबै मेटाउनुहोस्' : 'Clear All'}
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {clips.map((clip) => {
          const isSelected = clip.id === currentClipId;
          const dateStr = new Date(clip.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={clip.id}
              className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 text-left ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectClip(clip)}
                className="flex-1 text-left cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-indigo-400" />
                    <span>{clip.voice}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {clip.style}
                  </span>
                  {clip.isDialogue && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                      संवाद
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{dateStr}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {clip.text}
                </p>
              </button>

              <div className="flex items-center gap-1.5 shrink-0 self-center">
                <button
                  type="button"
                  onClick={() => onSelectClip(clip)}
                  title={isNepaliUi ? 'सुन्नुहोस्' : 'Play'}
                  className={`p-2 rounded-lg transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>

                <a
                  href={clip.audioUrl}
                  download={`dhvani-voice-${clip.voice.toLowerCase()}-${clip.id}.wav`}
                  title={isNepaliUi ? 'WAV डाउनलोड' : 'Download WAV'}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onDeleteClip(clip.id)}
                  title={isNepaliUi ? 'मेटाउनुहोस्' : 'Delete'}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
