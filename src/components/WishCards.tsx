import React from 'react';
import { motion } from 'motion/react';
import { BIRTHDAY_WISHES } from '../data/memories';
import { Smile, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const WishCards: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Smile':
        return <Smile className="w-5 h-5 text-amber-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500 fill-current" />;
      default:
        return <Heart className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Doa Tulus & Kebaikan</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Untaian Doa Untuk Laila
        </h2>
        <p className="mt-3 text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          Semoga setiap doa dan kebaikan ini menyertai setiap langkahmu di usia baru.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {BIRTHDAY_WISHES.map((wish, index) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card glass-card-hover p-6 rounded-3xl border border-white/20 shadow-2xl text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 border border-white/20 rounded-2xl">
                {getIcon(wish.iconName)}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#ff9a9e] uppercase tracking-widest">
                  {wish.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  {wish.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
              "{wish.content}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
