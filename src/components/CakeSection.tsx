import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Heart, Send, CheckCircle, FlameKindling } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CakeSection: React.FC = () => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [userWish, setUserWish] = useState('');
  const [wishSent, setWishSent] = useState(false);
  const [wishBalloons, setWishBalloons] = useState<string[]>([]);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);

    // Firework confetti sequence
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f472b6', '#fb7185', '#38bdf8', '#fef08a', '#a855f7']
      });
    }, 250);
  };

  const handleRelightCandles = () => {
    setCandlesLit(true);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;

    setWishBalloons((prev) => [...prev, userWish]);
    setUserWish('');
    setWishSent(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fda4af', '#a7f3d0', '#fef08a']
    });

    setTimeout(() => {
      setWishSent(false);
    }, 4000);
  };

  return (
    <section id="cake-section" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto my-12 glass-panel rounded-[32px] border border-white/30 shadow-2xl relative overflow-hidden text-white">
      {/* Background ambient sparkles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ff9a9e]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#a18cd1]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Momen Tiup Lilin & Harapan</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Kue Ulang Tahun Laila
        </h2>

        <p className="mt-2 text-white/80 text-sm sm:text-base max-w-lg mx-auto">
          Tutup matamu sejenak, panjatkan harapan terbaik di dalam hati, lalu klik tombol untuk meniup lilinnya! ✨
        </p>

        {/* Interactive Cake Visual */}
        <div className="my-10 relative max-w-md mx-auto">
          {/* Cake Frame in Frosted Glass */}
          <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-panel p-2 border border-white/30 shadow-2xl">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src="/src/assets/images/birthday_cake_1784826667613.jpg"
                alt="Birthday Cake for Laila"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Candle Flames Animation Overlay */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-20">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="relative flex flex-col items-center">
                    <AnimatePresence>
                      {candlesLit ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
                          exit={{ opacity: 0, scale: 0, y: -10 }}
                          transition={{ repeat: Infinity, duration: 0.8 + num * 0.2 }}
                          className="w-6 h-8 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] flex items-center justify-center"
                        >
                          <Flame className="w-6 h-8 fill-amber-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -20 }}
                          transition={{ duration: 1.5 }}
                          className="text-xs text-white/80 font-bold italic"
                        >
                          💨
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blow Candle Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {candlesLit ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlowCandles}
                id="blow-candles-button"
                className="w-full sm:w-auto px-8 py-3.5 glass-button-primary text-slate-900 font-bold text-base rounded-2xl shadow-xl flex items-center justify-center gap-3"
              >
                <Flame className="w-5 h-5 text-slate-900 animate-pulse" />
                <span>Make a Wish & Tiup Lilin! 🎂</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRelightCandles}
                className="w-full sm:w-auto px-6 py-3 glass-button text-white font-medium text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                <FlameKindling className="w-4 h-4 text-[#ff9a9e]" />
                <span>Nyalakan Lilin Kembali</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Send Wish to the Sky Interactive Form */}
        <div className="mt-12 pt-8 border-t border-white/20 max-w-xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-white flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-[#ff9a9e] fill-current" />
            <span>Kirim Doa & Harapan Laila ke Langit</span>
          </h3>
          <p className="text-xs text-white/70 mt-1 mb-4">
            Tuliskan apa saja impian yang paling kamu harapkan di tahun baru usiamu ini.
          </p>

          <form onSubmit={handleSendWish} className="flex gap-2">
            <input
              type="text"
              value={userWish}
              onChange={(e) => setUserWish(e.target.value)}
              placeholder="Contoh: Semoga selalu bahagia, lulus dengan nilai terbaik, dan sehat..."
              className="flex-1 px-4 py-3 rounded-2xl glass-input text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 glass-button-primary text-slate-900 font-bold rounded-2xl text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
            >
              <span>Kirim</span>
              <Send className="w-4 h-4 text-slate-900" />
            </button>
          </form>

          {/* Confirmation Message */}
          <AnimatePresence>
            {wishSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 glass-card border-emerald-400/50 text-emerald-200 rounded-2xl text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Harapanmu telah diterbangkan bersama ribuan bintang kebahagiaan! ✨</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Balloons list */}
          {wishBalloons.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {wishBalloons.map((w, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs text-white border border-white/20 shadow-sm"
                >
                  <span>🎈</span>
                  <span>"{w}"</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
