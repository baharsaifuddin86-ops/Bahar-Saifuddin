import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SPECIAL_REASONS } from '../data/memories';
import {
  Sun,
  HeartHandshake,
  Sparkles,
  Award,
  Coffee,
  Crown,
  Heart
} from 'lucide-react';

export const ReasonsGrid: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-indigo-500" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-amber-700 dark:text-amber-400" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      default:
        return <Heart className="w-6 h-6 text-rose-500" />;
    }
  };

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const incrementLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-3">
          <Heart className="w-3.5 h-3.5 fill-current text-[#ff9a9e]" />
          <span>Sifat & Keistimewaan Laila</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Mengapa Laila Sangat Spesial?
        </h2>
        <p className="mt-3 text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          Klik setiap kartu untuk membaca ungkapan rasa kagum dan alasan mengapa hadirmu selalu berarti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECIAL_REASONS.map((reason, idx) => {
          const isFlipped = !!flippedCards[reason.id];
          const likes = likeCounts[reason.id] || 0;

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => toggleFlip(reason.id)}
              className="cursor-pointer group relative min-h-[200px] glass-card glass-card-hover rounded-3xl p-6 border border-white/20 shadow-2xl flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    {getIcon(reason.iconName)}
                  </div>
                  <span className="text-2xl font-serif font-bold text-white/40">
                    #{reason.number}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-[#ff9a9e] transition-colors">
                  {reason.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {reason.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-[11px] text-white/60 font-medium italic">
                  Klik untuk apresiasi ✨
                </span>

                <button
                  onClick={(e) => incrementLike(e, reason.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-button text-xs font-semibold text-white"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes > 0 ? 'fill-[#ff9a9e] text-[#ff9a9e]' : ''}`} />
                  <span>{likes} Love</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
