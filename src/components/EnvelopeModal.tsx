import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, X, Volume2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_LETTER_TEXT } from '../data/memories';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMusic: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onClose,
  onStartMusic,
}) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [copied, setCopied] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fef08a']
    });
  };

  const handleOpenEnvelope = () => {
    setIsOpenState(true);
    triggerConfetti();
    onStartMusic();
  };

  // Typewriter effect when letter opens
  useEffect(() => {
    if (isOpenState) {
      let index = 0;
      setDisplayedText('');
      const interval = setInterval(() => {
        if (index < LOVE_LETTER_TEXT.length) {
          setDisplayedText((prev) => prev + LOVE_LETTER_TEXT.charAt(index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [isOpenState]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(LOVE_LETTER_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <AnimatePresence>
        {!isOpenState ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-lg glass-panel p-8 rounded-3xl shadow-2xl border border-white/30 text-center flex flex-col items-center text-white"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#ff9a9e] animate-bounce">
              <Mail className="w-10 h-10" />
            </div>

            <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-white bg-white/10 border border-white/20 rounded-full mb-3">
              Surat Rahasia Ulang Tahun
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Untuk Laila Nur Azizah
            </h3>

            <p className="text-white/80 text-sm mb-8 max-w-sm">
              Ada sebuah pesan hangat dan doa tulus yang telah dituliskan khusus untuk memperingati hari bahagiamu hari ini.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenEnvelope}
              id="open-letter-button"
              className="w-full py-4 px-6 glass-button-primary text-slate-900 font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 group transition-transform"
            >
              <Sparkles className="w-5 h-5 text-slate-900 group-hover:rotate-12 transition-transform" />
              <span>Buka Surat Cinta Laila</span>
              <Heart className="w-5 h-5 fill-current text-slate-900 group-hover:scale-125 transition-transform" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl glass-panel p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/30 my-8 backdrop-blur-2xl text-white"
          >
            {/* Wax Seal Aesthetic Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-button-primary text-slate-900 flex items-center justify-center shadow-lg border border-white/40">
              <Heart className="w-6 h-6 fill-current text-slate-900" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-4 mb-6 text-center border-b border-white/20 pb-4">
              <span className="text-xs font-serif italic text-[#ff9a9e] tracking-wider uppercase">
                Special Birthday Letter • 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Laila Nur Azizah
              </h2>
            </div>

            <div className="font-serif leading-relaxed text-white/90 text-sm sm:text-base whitespace-pre-line min-h-[260px] glass-card p-5 sm:p-6 rounded-2xl border border-white/20">
              {displayedText}
              {displayedText.length < LOVE_LETTER_TEXT.length && (
                <span className="inline-block w-2 h-4 bg-[#ff9a9e] ml-1 animate-pulse" />
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs text-[#ff9a9e]">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Diiringi melodi khusus ulang tahun</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none px-4 py-2 glass-button text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Ucapan</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2 glass-button-primary text-slate-900 font-bold rounded-xl text-xs shadow-md"
                >
                  Lanjut ke Galeri Foto ➔
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
