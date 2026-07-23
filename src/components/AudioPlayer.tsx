import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Settings, Upload, X, Check, RotateCcw } from 'lucide-react';
import { loadSettingFromStorage, saveSettingToStorage } from '../utils/db';

interface AudioPlayerProps {
  autoPlayRequest?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ autoPlayRequest }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(() => {
    return localStorage.getItem('laila_custom_bg_music') || null;
  });
  const [customAudioTitle, setCustomAudioTitle] = useState<string>(() => {
    return localStorage.getItem('laila_custom_bg_music_title') || 'Melodi Ulang Tahun Laila';
  });

  // Load custom music from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      loadSettingFromStorage('laila_custom_bg_music'),
      loadSettingFromStorage('laila_custom_bg_music_title')
    ]).then(([url, title]) => {
      if (isMounted) {
        if (url) setCustomAudioUrl(url);
        if (title) setCustomAudioTitle(title);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  // Gentle synth chords / melody notes for Happy Birthday / Romantic tune
  const melodyNotes = [
    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 293.66, note: 'D4', duration: 0.8 },
    { freq: 261.63, note: 'C4', duration: 0.8 },
    { freq: 349.23, note: 'F4', duration: 0.8 },
    { freq: 329.63, note: 'E4', duration: 1.2 },

    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 293.66, note: 'D4', duration: 0.8 },
    { freq: 261.63, note: 'C4', duration: 0.8 },
    { freq: 392.00, note: 'G4', duration: 0.8 },
    { freq: 349.23, note: 'F4', duration: 1.2 },

    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 261.63, note: 'C4', duration: 0.5 },
    { freq: 523.25, note: 'C5', duration: 0.8 },
    { freq: 440.00, note: 'A4', duration: 0.8 },
    { freq: 349.23, note: 'F4', duration: 0.8 },
    { freq: 329.63, note: 'E4', duration: 0.8 },
    { freq: 293.66, note: 'D4', duration: 1.2 },

    { freq: 466.16, note: 'A#4', duration: 0.5 },
    { freq: 466.16, note: 'A#4', duration: 0.5 },
    { freq: 440.00, note: 'A4', duration: 0.8 },
    { freq: 349.23, note: 'F4', duration: 0.8 },
    { freq: 392.00, note: 'G4', duration: 0.8 },
    { freq: 349.23, note: 'F4', duration: 1.5 }
  ];

  const playTone = (freq: number, duration: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.05);

      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime);
      subGain.gain.setValueAtTime(0.001, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.05);

      osc.connect(gain);
      subOsc.connect(subGain);
      gain.connect(ctx.destination);
      subGain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      subOsc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      subOsc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback handling
    }
  };

  const startMusicLoop = () => {
    if (customAudioUrl) {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch((err) => {
          console.warn('Autoplay blocked for custom audio:', err);
        });
      }
      return;
    }

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    let noteIdx = 0;

    const scheduleNextNote = () => {
      if (!isPlayingRef.current) return;

      const current = melodyNotes[noteIdx];
      setCurrentNote(current.note);
      playTone(current.freq, current.duration);

      const nextDelay = current.duration * 1000 + 80;
      noteIdx = (noteIdx + 1) % melodyNotes.length;

      timerRef.current = window.setTimeout(scheduleNextNote, nextDelay);
    };

    scheduleNextNote();
  };

  const stopMusicLoop = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusicLoop();
    } else {
      startMusicLoop();
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioData = reader.result as string;
        saveSettingToStorage('laila_custom_bg_music', audioData);
        saveSettingToStorage('laila_custom_bg_music_title', file.name);

        stopMusicLoop();
        setCustomAudioUrl(audioData);
        setCustomAudioTitle(file.name);
        setUploadSuccessMsg('Lagu berhasil diganti & tersimpan otomatis! Sila putar musik.');
        setTimeout(() => setUploadSuccessMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAudioUrl = () => {
    if (!inputUrl.trim()) return;
    stopMusicLoop();
    const title = 'Musik Pilihan (URL)';
    setCustomAudioUrl(inputUrl.trim());
    setCustomAudioTitle(title);
    saveSettingToStorage('laila_custom_bg_music', inputUrl.trim());
    saveSettingToStorage('laila_custom_bg_music_title', title);
    setInputUrl('');
    setUploadSuccessMsg('URL Musik berhasil disimpan!');
    setTimeout(() => setUploadSuccessMsg(''), 3000);
  };

  const handleResetDefaultMusic = () => {
    stopMusicLoop();
    setCustomAudioUrl(null);
    setCustomAudioTitle('Melodi Ulang Tahun Laila');
    saveSettingToStorage('laila_custom_bg_music', null);
    saveSettingToStorage('laila_custom_bg_music_title', null);
    setUploadSuccessMsg('Kembali ke Melodi bawaan!');
    setTimeout(() => setUploadSuccessMsg(''), 3000);
  };

  useEffect(() => {
    let attempted = false;

    const tryAutoPlay = () => {
      if (!isPlayingRef.current) {
        startMusicLoop();
      }
    };

    // Attempt direct autoplay
    const timer = setTimeout(() => {
      tryAutoPlay();
    }, 500);

    // Fallback on first user gesture if browser blocked direct autoplay
    const handleFirstGesture = () => {
      if (!isPlayingRef.current) {
        startMusicLoop();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [autoPlayRequest, customAudioUrl]);

  useEffect(() => {
    return () => {
      stopMusicLoop();
    };
  }, []);

  return (
    <>
      {/* HTML Audio element if custom audio source exists */}
      {customAudioUrl && (
        <audio
          ref={htmlAudioRef}
          src={customAudioUrl}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Control Bar Floating Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 glass-panel px-3.5 py-2 rounded-full shadow-2xl border border-white/30 text-white">
        <button
          onClick={toggleMusic}
          id="audio-toggle-button"
          className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm focus:outline-none"
        >
          <div className={`p-2 rounded-full transition-colors ${isPlaying ? 'glass-button-primary text-slate-900 animate-pulse' : 'glass-button text-white'}`}>
            {isPlaying ? <Volume2 className="w-4 h-4 text-slate-900" /> : <VolumeX className="w-4 h-4 text-white" />}
          </div>
          <span className="hidden sm:inline-block truncate max-w-[140px]">
            {isPlaying ? customAudioTitle : 'Putar Musik'}
          </span>
        </button>

        {isPlaying && !customAudioUrl && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
            <div className="flex items-end h-4 gap-0.5">
              <span className="w-1 bg-[#ff9a9e] h-full rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1 bg-[#fad0c4] h-2/3 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1 bg-[#a18cd1] h-5/6 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
            <span className="text-[10px] text-[#ff9a9e] font-mono tracking-wider ml-1">
              ♪ {currentNote}
            </span>
          </div>
        )}

        {/* Change Music Button */}
        <button
          onClick={() => setShowModal(true)}
          className="p-2 rounded-full glass-button text-white/90 hover:text-white transition-colors border-l border-white/20 pl-2.5"
          title="Ubah Musik / Lagu"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Change Music Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-3xl border border-white/30 shadow-2xl relative text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-white/10 text-[#ff9a9e] border border-white/20">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Ganti Musik Latar</h3>
                <p className="text-xs text-white/60">Pilih musik kesukaanmu untuk momen ini</p>
              </div>
            </div>

            {uploadSuccessMsg && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-4 my-4">
              {/* Option 1: File Upload */}
              <div className="p-3.5 rounded-2xl glass-card border border-white/20">
                <label className="block text-xs font-semibold mb-1.5 text-white">
                  1. Unggah File Musik (MP3 / Audio)
                </label>
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 glass-button-primary text-slate-900 rounded-xl text-xs font-bold cursor-pointer w-full shadow-md hover:scale-[1.02] transition-transform">
                  <Upload className="w-4 h-4 text-slate-900" />
                  <span>Pilih File Lagu dari Perangkat</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option 2: Paste Audio URL */}
              <div className="p-3.5 rounded-2xl glass-card border border-white/20 space-y-2">
                <label className="block text-xs font-semibold text-white">
                  2. Tempel Link / URL Musik
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Contoh: https://site.com/lagu.mp3"
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <button
                    onClick={handleSaveAudioUrl}
                    className="px-3.5 py-2 glass-button text-white text-xs font-bold rounded-xl"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Current Track & Reset */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-white/50 text-[10px] block uppercase">Lagu Aktif saat ini:</span>
                  <span className="font-semibold text-white truncate max-w-[200px] block">
                    {customAudioTitle}
                  </span>
                </div>
                {customAudioUrl && (
                  <button
                    onClick={handleResetDefaultMusic}
                    className="flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-200 underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl glass-button text-white text-xs font-bold"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

