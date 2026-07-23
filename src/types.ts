export interface PhotoMemory {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  rotateDegree: number;
  sticker?: string;
  tag?: string;
}

export interface BirthdayWish {
  id: string;
  category: string;
  title: string;
  content: string;
  iconName: string;
}

export interface SpecialReason {
  id: string;
  number: number;
  title: string;
  detail: string;
  iconName: string;
}

export interface PlaylistItem {
  title: string;
  artist: string;
  duration: string;
  freqs: number[];
}
