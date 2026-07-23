import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PhotoMemory } from '../types';
import {
  Heart,
  Maximize2,
  Upload,
  X,
  Edit3,
  Camera,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  LayoutGrid,
  Video,
  Film,
  Play
} from 'lucide-react';

interface PolaroidGalleryProps {
  memories: PhotoMemory[];
  onUpdateMemory: (updated: PhotoMemory) => void;
  onAddMemory: (newMemory: PhotoMemory) => void;
  compactMode?: boolean;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  memories,
  onUpdateMemory,
  onAddMemory,
  compactMode = true
}) => {
  const [activeTag, setActiveTag] = useState<string>('Semua');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [editingMemory, setEditingMemory] = useState<PhotoMemory | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isVideoMedia, setIsVideoMedia] = useState(false);

  // Extract unique tags
  const tags = ['Semua', ...Array.from(new Set(memories.map((m) => m.tag || 'Moment')))];

  const filteredMemories = activeTag === 'Semua'
    ? memories
    : memories.filter((m) => m.tag === activeTag);

  const currentMem = filteredMemories[currentIndex % Math.max(1, filteredMemories.length)] || memories[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredMemories.length);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.6 },
      colors: ['#ff9a9e', '#a18cd1', '#fad0c4']
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredMemories.length) % filteredMemories.length);
  };

  const [toastMsg, setToastMsg] = useState('');

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setIsVideoMedia(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIsVideoMedia(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setPreviewImage(compressed);
          } else {
            setPreviewImage(rawUrl);
          }
        };
        img.onerror = () => {
          setPreviewImage(rawUrl);
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (!editingMemory) return;
    const updated: PhotoMemory = {
      ...editingMemory,
      title: newTitle || editingMemory.title,
      date: newDate || editingMemory.date,
      description: newDesc || editingMemory.description,
      imageUrl: previewImage || editingMemory.imageUrl,
      videoUrl: isVideoMedia ? previewImage : undefined,
      isVideo: isVideoMedia
    };
    onUpdateMemory(updated);
    setEditingMemory(null);
    setToastMsg('✨ Foto/Video berhasil disimpan!');
    setTimeout(() => setToastMsg(''), 3000);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#4ade80', '#38bdf8', '#ff9a9e']
    });
  };

  const handleOpenEditModal = (mem: PhotoMemory) => {
    setEditingMemory(mem);
    setNewTitle(mem.title);
    setNewDate(mem.date);
    setNewDesc(mem.description);
    setPreviewImage(mem.videoUrl || mem.imageUrl);
    setIsVideoMedia(!!mem.isVideo);
  };

  const handleAddNewPhoto = () => {
    const newMem: PhotoMemory = {
      id: Date.now().toString(),
      title: 'Momen Baru Laila',
      date: 'Hari Bahagia',
      location: 'Spesial',
      description: 'Momen indah tersimpan abadi.',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
      rotateDegree: (Math.random() - 0.5) * 6,
      sticker: '💖',
      tag: 'New'
    };
    onAddMemory(newMem);
    handleOpenEditModal(newMem);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="mb-3 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5 shadow-lg">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/20 backdrop-blur-md">
          <button
            onClick={() => setViewMode('stack')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'stack'
                ? 'glass-button-primary text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mode Stack 3D</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'glass-button-primary text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Mode Grid</span>
          </button>
        </div>

        {/* Add Photo Button */}
        <button
          onClick={handleAddNewPhoto}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold glass-button-primary text-slate-900 flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
        >
          <Plus className="w-3.5 h-3.5 text-slate-900" />
          <span>Tambah Foto</span>
        </button>
      </div>

      {/* Stack 3D View Mode */}
      {viewMode === 'stack' ? (
        <div className="relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px]">
          {/* Card Deck Stage */}
          <div className="relative w-full max-w-sm sm:max-w-md h-[300px] sm:h-[340px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {filteredMemories.map((mem, idx) => {
                const diff = (idx - currentIndex + filteredMemories.length) % filteredMemories.length;
                if (diff > 2 && diff < filteredMemories.length - 1) return null;

                const isTop = diff === 0;
                const offset = diff * 12;
                const scale = 1 - diff * 0.05;
                const rotate = isTop ? mem.rotateDegree || 0 : diff * 3;

                return (
                  <motion.div
                    key={mem.id}
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{
                      scale: scale,
                      opacity: diff > 2 ? 0 : 1 - diff * 0.25,
                      y: offset,
                      rotate: rotate,
                      zIndex: 30 - diff
                    }}
                    exit={{ scale: 0.8, opacity: 0, x: 200, rotate: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`absolute w-[240px] sm:w-[280px] glass-card p-3 pb-3.5 rounded-2xl border border-white/25 shadow-2xl transition-shadow ${
                      isTop ? 'cursor-grab active:cursor-grabbing hover:border-[#ff9a9e]/70' : 'pointer-events-none'
                    }`}
                  >
                    {/* Washi Tape Accent */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-white/25 backdrop-blur-md border-y border-dashed border-white/40 rotate-[-2deg] z-10 pointer-events-none rounded-xs" />

                    {/* Photo / Video Container */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-900/80 border border-white/10 group">
                      {mem.isVideo ? (
                        <video
                          src={mem.videoUrl || mem.imageUrl}
                          className="w-full h-full object-cover select-none pointer-events-none"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={mem.imageUrl}
                          alt="Foto Laila"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                      )}

                      {mem.isVideo && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1 border border-white/20 z-10">
                          <Video className="w-3 h-3 text-[#ff9a9e]" />
                          <span>Video</span>
                        </div>
                      )}

                      {isTop && (
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                          <button
                            onClick={() => setSelectedPhotoIndex(memories.findIndex((m) => m.id === mem.id))}
                            className="p-2.5 bg-white/90 text-slate-900 rounded-full hover:bg-white transition-transform hover:scale-110 shadow-lg"
                            title="Perbesar"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(mem)}
                            className="p-2.5 glass-button-primary text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                            title="Ganti Foto / Video"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {mem.sticker && !mem.isVideo && (
                        <div className="absolute top-2 right-2 text-lg drop-shadow-md z-10">
                          {mem.sticker}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Controls Below Stack */}
          <div className="flex items-center gap-4 mt-3 z-20">
            <button
              onClick={handlePrev}
              className="p-2.5 glass-button text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              {filteredMemories.length > 0 ? (currentIndex % filteredMemories.length) + 1 : 0} / {filteredMemories.length}
            </span>

            <button
              onClick={handleNext}
              className="p-2.5 glass-button-primary text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg"
              title="Selanjutnya"
            >
              <ChevronRight className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>
      ) : (
        /* Compact Grid View Mode */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {filteredMemories.map((mem) => (
            <motion.div
              key={mem.id}
              whileHover={{ scale: 1.03 }}
              className="group relative glass-card p-2 rounded-xl border border-white/20 shadow-lg text-center"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-900/60 border border-white/10">
                {mem.isVideo ? (
                  <video
                    src={mem.videoUrl || mem.imageUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={mem.imageUrl}
                    alt="Foto Laila"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}

                {mem.isVideo && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[9px] text-white flex items-center gap-1 border border-white/20">
                    <Video className="w-2.5 h-2.5 text-[#ff9a9e]" />
                    <span>Video</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setSelectedPhotoIndex(memories.findIndex((m) => m.id === mem.id))}
                    className="p-2 bg-white/90 text-slate-900 rounded-full"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(mem)}
                    className="p-2 glass-button-primary text-slate-900 rounded-full"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && memories[selectedPhotoIndex] && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 rounded-full border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setSelectedPhotoIndex(
                  (selectedPhotoIndex - 1 + memories.length) % memories.length
                )
              }
              className="absolute left-4 sm:left-8 p-3 text-white/80 hover:text-white bg-white/10 rounded-full border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setSelectedPhotoIndex((selectedPhotoIndex + 1) % memories.length)
              }
              className="absolute right-4 sm:right-8 p-3 text-white/80 hover:text-white bg-white/10 rounded-full border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl w-full glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/30 p-3 sm:p-4"
            >
              <div className="bg-slate-950/80 rounded-2xl overflow-hidden flex items-center justify-center relative p-2 min-h-[300px] max-h-[65vh]">
                {memories[selectedPhotoIndex].isVideo ? (
                  <video
                    src={memories[selectedPhotoIndex].videoUrl || memories[selectedPhotoIndex].imageUrl}
                    controls
                    autoPlay
                    className="max-h-[60vh] w-auto rounded-xl"
                  />
                ) : (
                  <img
                    src={memories[selectedPhotoIndex].imageUrl}
                    alt="Foto Laila"
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] w-auto object-contain rounded-xl"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-3 px-2">
                <span className="text-xs font-semibold text-white/70">
                  {memories[selectedPhotoIndex].isVideo ? 'Video' : 'Foto'} {selectedPhotoIndex + 1} dari {memories.length}
                </span>

                <button
                  onClick={() => {
                    const current = memories[selectedPhotoIndex];
                    setSelectedPhotoIndex(null);
                    handleOpenEditModal(current);
                  }}
                  className="px-4 py-1.5 glass-button-primary text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-900" />
                  <span>Ganti File</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit / Upload Modal */}
      <AnimatePresence>
        {editingMemory && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/30 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#ff9a9e]" />
                  <span>Edit / Unggah Foto & Video Laila</span>
                </h3>
                <button
                  onClick={() => setEditingMemory(null)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 my-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">
                    Upload atau Pilih Foto / Video
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-28 h-32 rounded-xl overflow-hidden bg-slate-900/80 border border-white/20 flex-shrink-0 flex items-center justify-center relative">
                      {isVideoMedia ? (
                        <video
                          src={previewImage}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={previewImage}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-2.5 w-full">
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 glass-button-primary text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-105 shadow-md w-full justify-center">
                        <Upload className="w-4 h-4 text-slate-900" />
                        <span>Pilih Foto / Video dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaFileChange}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        value={previewImage}
                        onChange={(e) => {
                          setPreviewImage(e.target.value);
                          if (e.target.value.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
                            setIsVideoMedia(true);
                          }
                        }}
                        placeholder="Atau tempel Link / URL Foto atau Video..."
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />

                      <div className="flex items-center gap-3 text-xs text-white/80 pt-1">
                        <span className="text-[11px] text-white/60">Tipe Media:</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="mediaType"
                            checked={!isVideoMedia}
                            onChange={() => setIsVideoMedia(false)}
                            className="accent-[#ff9a9e]"
                          />
                          <span>Foto 📷</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="mediaType"
                            checked={isVideoMedia}
                            onChange={() => setIsVideoMedia(true)}
                            className="accent-[#ff9a9e]"
                          />
                          <span>Video 🎥</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/20">
                <button
                  onClick={() => setEditingMemory(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-white/60 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 glass-button-primary text-slate-900 font-bold rounded-xl text-xs shadow-lg"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

