import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Check, Copy } from 'lucide-react';

interface AudioWaveformProps {
  audioUrl: string;
  voiceName: string;
  styleName: string;
  textSnippet: string;
  isNepaliUi: boolean;
  onDownload?: () => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  voiceName,
  styleName,
  textSnippet,
  isNepaliUi,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      // Auto-play when new audio is loaded
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay may be blocked by browser until user gesture
        setIsPlaying(false);
      });
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `dhvani-ai-voice-${voiceName.toLowerCase()}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate 48 stylized visualizer bars
  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Ambient glowing radial effect */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-slate-500'}`}
            ></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isPlaying
              ? isNepaliUi
                ? 'आवाज बजिरहेको छ...'
                : 'Now Playing Voice'
              : isNepaliUi
                ? 'तयार भएको आवाज'
                : 'Synthesized Voice'}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {voiceName}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {styleName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title={isNepaliUi ? 'पाठ कपी गर्नुहोस्' : 'Copy Text'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isNepaliUi ? 'कपी भयो!' : 'Copied!') : isNepaliUi ? 'कपी' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            title={isNepaliUi ? 'उच्च गुणस्तर WAV डाउनलोड गर्नुहोस्' : 'Download WAV Audio'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isNepaliUi ? 'WAV डाउनलोड' : 'Download WAV'}</span>
          </button>
        </div>
      </div>

      {/* Visual Audio Waveform Equalizer */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-5">
        <div className="flex items-end justify-between gap-1 h-20 w-full px-2">
          {Array.from({ length: 48 }).map((_, idx) => {
            const barProgress = idx / 48;
            const isPassed = barProgress <= progressRatio;
            // Simulated pleasant organic sound wave height
            const baseSin = Math.sin(idx * 0.4) * 0.5 + 0.5;
            const cosWave = Math.cos(idx * 0.2) * 0.3 + 0.5;
            let dynamicHeight = (baseSin * 0.6 + cosWave * 0.4) * 100;
            dynamicHeight = Math.max(15, Math.min(95, dynamicHeight));

            return (
              <div
                key={idx}
                onClick={() => {
                  if (audioRef.current && duration > 0) {
                    const seekTo = (idx / 48) * duration;
                    audioRef.current.currentTime = seekTo;
                    setCurrentTime(seekTo);
                  }
                }}
                className={`flex-1 rounded-full cursor-pointer transition-all duration-150 ${
                  isPassed
                    ? 'bg-gradient-to-t from-indigo-500 via-indigo-400 to-emerald-400 shadow-sm shadow-indigo-500/40'
                    : 'bg-slate-800 hover:bg-slate-700'
                } ${isPlaying && isPassed ? 'opacity-100' : 'opacity-70'}`}
                style={{
                  height: `${dynamicHeight}%`,
                  transform: isPlaying && isPassed ? 'scaleY(1.08)' : 'scaleY(1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Scrub bar & Time */}
      <div className="space-y-1.5 mb-5">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />
        <div className="flex justify-between text-xs font-mono text-slate-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls and Speed Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            title={isNepaliUi ? 'सुरुबाट सुन्नुहोस्' : 'Restart Audio'}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 px-2">
            {isNepaliUi ? 'गति:' : 'Speed:'}
          </span>
          {[0.75, 1, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                playbackRate === speed
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
