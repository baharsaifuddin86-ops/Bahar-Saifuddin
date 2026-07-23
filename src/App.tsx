import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Camera, PartyPopper, Edit3, Upload, X, RotateCcw, Video, Image as ImageIcon } from 'lucide-react';
import { FloatingParticles } from './components/FloatingParticles';
import { AudioPlayer } from './components/AudioPlayer';
import { PolaroidGallery } from './components/PolaroidGallery';
import { INITIAL_MEMORIES } from './data/memories';
import { PhotoMemory } from './types';
import { loadMemoriesFromStorage, saveMemoriesToStorage, loadSettingFromStorage, saveSettingToStorage } from './utils/db';

const DEFAULT_BANNER = '/src/assets/images/birthday_banner_1784826645609.jpg';

export default function App() {
  const [memories, setMemories] = useState<PhotoMemory[]>(() => {
    const saved = localStorage.getItem('laila_memories_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEMORIES;
      }
    }
    return INITIAL_MEMORIES;
  });

  const [bannerUrl, setBannerUrl] = useState<string>(() => {
    return localStorage.getItem('laila_banner_url') || DEFAULT_BANNER;
  });
  const [isBannerVideo, setIsBannerVideo] = useState<boolean>(() => {
    return localStorage.getItem('laila_is_banner_video') === 'true';
  });

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerInputUrl, setBannerInputUrl] = useState('');
  const [bannerPreview, setBannerPreview] = useState(bannerUrl);
  const [bannerPreviewIsVideo, setBannerPreviewIsVideo] = useState(isBannerVideo);
  const [bannerToastMsg, setBannerToastMsg] = useState('');

  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'greeting' | 'gallery'>('all');

  // Load from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      loadMemoriesFromStorage(),
      loadSettingFromStorage('laila_banner_url'),
      loadSettingFromStorage('laila_is_banner_video')
    ]).then(([memData, bannerData, bannerVideoData]) => {
      if (isMounted) {
        if (memData && memData.length > 0) {
          setMemories(memData);
        }
        if (bannerData) {
          setBannerUrl(bannerData);
          setBannerPreview(bannerData);
        }
        if (bannerVideoData !== null) {
          const isVid = bannerVideoData === 'true';
          setIsBannerVideo(isVid);
          setBannerPreviewIsVideo(isVid);
        }
        setIsStorageLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save memories to IndexedDB & localStorage on change
  useEffect(() => {
    if (isStorageLoaded) {
      saveMemoriesToStorage(memories);
    }
  }, [memories, isStorageLoaded]);

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setBannerPreviewIsVideo(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreviewIsVideo(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = () => {
    const finalUrl = bannerInputUrl.trim() || bannerPreview;
    setBannerUrl(finalUrl);
    setIsBannerVideo(bannerPreviewIsVideo);
    saveSettingToStorage('laila_banner_url', finalUrl);
    saveSettingToStorage('laila_is_banner_video', bannerPreviewIsVideo ? 'true' : 'false');
    setShowBannerModal(false);
    setBannerInputUrl('');
    setBannerToastMsg('✨ Banner berhasil disimpan otomatis!');
    setTimeout(() => setBannerToastMsg(''), 3000);
  };

  const handleResetBanner = () => {
    setBannerUrl(DEFAULT_BANNER);
    setIsBannerVideo(false);
    setBannerPreview(DEFAULT_BANNER);
    setBannerPreviewIsVideo(false);
    saveSettingToStorage('laila_banner_url', null);
    saveSettingToStorage('laila_is_banner_video', null);
    setBannerToastMsg('Banner dikembalikan ke posisi semula!');
    setTimeout(() => setBannerToastMsg(''), 3000);
  };

  // Initial greeting confetti trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff9a9e', '#fad0c4', '#a18cd1', '#ffd166']
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateMemory = (updated: PhotoMemory) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const handleAddMemory = (newMem: PhotoMemory) => {
    setMemories((prev) => [newMem, ...prev]);
  };

  const handleFireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ff9a9e', '#a18cd1', '#38bdf8', '#4ade80', '#ffd166']
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-[#ff9a9e] selection:text-slate-900 relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Glowing Glass Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#ff9a9e] opacity-40 blur-[100px] animate-pulse [animation-duration:8s]" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[#a18cd1] opacity-40 blur-[120px] animate-pulse [animation-duration:10s]" />
        <div className="absolute top-[35%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#fad0c4] opacity-30 blur-[90px]" />
      </div>

      {/* Canvas Floating Petals & Hearts */}
      <FloatingParticles />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-[#ff9a9e] to-[#a18cd1] text-white rounded-xl shadow-md animate-bounce [animation-duration:3s]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
              Laila Nur Azizah
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFireConfetti}
              className="px-3.5 py-1.5 glass-button-primary text-slate-900 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
            >
              <PartyPopper className="w-4 h-4 text-slate-900" />
              <span className="hidden sm:inline">Rayakan 🎉</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-View Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative z-10">
        {/* Responsive Grid: Side-by-Side View on Desktop so NO SCROLLING DOWN is required! */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Greeting Banner & Words */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Toast Notification for Banner */}
            {bannerToastMsg && (
              <div className="mb-3 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5 shadow-lg">
                <span>{bannerToastMsg}</span>
              </div>
            )}

            {/* Banner Container with Edit Button */}
            <div className="relative mb-4 rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl group">
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-slate-900">
                {isBannerVideo ? (
                  <video
                    src={bannerUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={bannerUrl}
                    alt="Laila Birthday Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-semibold uppercase tracking-widest w-fit mb-1 border border-white/30">
                    Happy Birthday 🎉
                  </span>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold text-white">
                    Selamat Ulang Tahun, Laila! 🌹
                  </h2>
                </div>

                {/* Edit Banner Button */}
                <button
                  onClick={() => {
                    setBannerPreview(bannerUrl);
                    setBannerPreviewIsVideo(isBannerVideo);
                    setShowBannerModal(true);
                  }}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-md text-white text-xs font-medium border border-white/30 flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 z-10 opacity-90 group-hover:opacity-100"
                  title="Ganti Gambar / Video Banner Sampul"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ff9a9e]" />
                  <span className="hidden sm:inline">Ganti Banner</span>
                </button>
              </div>
            </div>

            {/* Main Greeting Card */}
            <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/30 shadow-2xl relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ucapan & Doa Tulus</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Selamat Ulang Tahun, <br />
                <span className="bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#a18cd1] bg-clip-text text-transparent">
                  Laila Nur Azizah
                </span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#ff9a9e] pl-3 py-1">
                "Selamat bertambah usia untuk Laila Nur Azizah. Semoga di usiamu yang baru ini, senantiasa dilimpahkan kebahagiaan yang tak pernah usai, kesehatan yang selalu terjaga, kelancaran dalam segala urusan, serta hari-hari yang selalu dihiasi senyuman dan kehangatan."
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15">
                <span className="text-[11px] text-white/60">
                  Special Day • 2026
                </span>
                <button
                  onClick={handleFireConfetti}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-[#ff9a9e] bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-[#ff9a9e]" />
                  <span>Kirim Cinta ❤️</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Polaroid Gallery (Fits directly in viewport!) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 glass-panel p-4 sm:p-6 rounded-3xl border border-white/30 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 text-[#ff9a9e]">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  Galeri Foto Polaroid
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-white/60">
                Laila's Memories ✨
              </span>
            </div>

            <PolaroidGallery
              memories={memories}
              onUpdateMemory={handleUpdateMemory}
              onAddMemory={handleAddMemory}
              compactMode={true}
            />
          </motion.div>

        </div>
      </main>

      {/* Audio Player in Floating Control */}
      <AudioPlayer autoPlayRequest={true} />

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-white/10 bg-white/5 backdrop-blur-xl text-center text-xs text-white/60 relative z-10">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-[#ff9a9e] fill-current animate-pulse" />
          <p className="font-serif text-xs text-white/80">
            Khusus untuk <strong className="text-white font-bold">Laila Nur Azizah</strong> • Happy Birthday 🎉
          </p>
        </div>
      </footer>

      {/* Modal Edit Banner */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full glass-panel p-5 rounded-3xl border border-white/30 shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#ff9a9e]" />
                <span>Ganti Foto / Video Banner Sampul</span>
              </h3>
              <button
                onClick={() => setShowBannerModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Pratinjau Banner
                </label>
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-slate-900 border border-white/20">
                  {bannerPreviewIsVideo ? (
                    <video
                      src={bannerPreview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Unggah dari Perangkat
                </label>
                <label className="w-full py-2 px-3 glass-button-primary text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] transition-transform">
                  <Upload className="w-4 h-4 text-slate-900" />
                  <span>Pilih Foto / Video Banner</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleBannerFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Atau Gunakan Link / URL
                </label>
                <input
                  type="text"
                  value={bannerInputUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setBannerInputUrl(url);
                    if (url) {
                      setBannerPreview(url);
                      if (url.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
                        setBannerPreviewIsVideo(true);
                      }
                    }
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              {/* Banner Type Option */}
              <div className="flex items-center gap-4 text-xs text-white/80 pt-1">
                <span className="text-[11px] text-white/60">Tipe File:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bannerMediaType"
                    checked={!bannerPreviewIsVideo}
                    onChange={() => setBannerPreviewIsVideo(false)}
                    className="accent-[#ff9a9e]"
                  />
                  <span>Foto 📷</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bannerMediaType"
                    checked={bannerPreviewIsVideo}
                    onChange={() => setBannerPreviewIsVideo(true)}
                    className="accent-[#ff9a9e]"
                  />
                  <span>Video 🎥</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <button
                onClick={handleResetBanner}
                className="px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1 hover:bg-white/10 rounded-xl transition-colors"
                title="Kembalikan ke gambar awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Bawaan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBannerModal(false)}
                  className="px-3.5 py-1.5 text-xs text-white/70 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBanner}
                  className="px-4 py-1.5 glass-button-primary text-slate-900 font-bold rounded-xl text-xs shadow-lg"
                >
                  Simpan Banner
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


