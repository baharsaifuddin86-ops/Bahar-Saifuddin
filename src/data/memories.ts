import { PhotoMemory, BirthdayWish, SpecialReason } from '../types';

export const INITIAL_MEMORIES: PhotoMemory[] = [
  {
    id: '1',
    title: 'Senyum Ceria & Pose Gemoy',
    date: 'Momen Penuh Keceriaan',
    location: 'Hangout Favorit',
    description: 'Senyuman dan tingkah lucu Laila yang selalu sukses bikin hari-hari jadi jauh lebih berwarna dan bahagia.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    rotateDegree: -3,
    sticker: '✨',
    tag: 'Cute Moment'
  },
  {
    id: '2',
    title: 'Buket Mawar Pink Romantis',
    date: 'Kejutan Istimewa',
    location: 'Dalam Perjalanan Indah',
    description: 'Senyum hangat Laila saat menggenggam buket mawar merah muda. Kecantikanmu selalu mengalahkan mekarnya bunga apapun.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    rotateDegree: 2,
    sticker: '🌹',
    tag: 'Sweet Floral'
  },
  {
    id: '3',
    title: 'Menikmati Senja di Atas Danau',
    date: 'Suasana Sore yang Syahdu',
    location: 'Pemandangan Indah',
    description: 'Duduk bersama menikmati indahnya pemandangan danau dan langit senja. Ketenangan terbaik adalah saat berada di dekat Laila.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    rotateDegree: -2,
    sticker: '🌅',
    tag: 'Sunset View'
  },
  {
    id: '4',
    title: 'Petualangan & Gaya Cool Laila',
    date: 'Momen Seru Bersama',
    location: 'Outdoor Adventure',
    description: 'Selalu tampil kece, hangat, dan siap menjelajahi hal-hal baru. Gaya santai Laila selalu punya daya tarik tersendiri.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    rotateDegree: 4,
    sticker: '🕶️',
    tag: 'Cool Vibes'
  },
  {
    id: '5',
    title: 'Mecamocha & Wink Cute Moment',
    date: 'Waktu Bersantai',
    location: 'Mecamocha Coffee Shop',
    description: 'Kedipan mata manis dengan pesan "powered by caffeine". Momen santai di kafe favorit yang tak pernah membosankan.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    rotateDegree: -4,
    sticker: '☕',
    tag: 'Cafe Time'
  },
  {
    id: '6',
    title: 'Momen Muka Bangga & Buket Putih',
    date: 'Pencapaian Spesial',
    location: 'Hari Kebanggaan',
    description: 'Momen penuh rasa bangga dan syukur. Anggun berseragam dengan buket putih indah di bawah rindangnya pepohonan.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    rotateDegree: 3,
    sticker: '🎓',
    tag: 'Proud Day'
  }
];

export const BIRTHDAY_WISHES: BirthdayWish[] = [
  {
    id: 'w1',
    category: 'Kebahagiaan',
    title: 'Semoga Selalu Dikelilingi Senyuman',
    content: 'Di usia baru ini, semoga Laila selalu diberikan kebahagiaan yang melimpah, tawa yang tak pernah usai, dan kedamaian di setiap langkah hidupmu.',
    iconName: 'Smile'
  },
  {
    id: 'w2',
    category: 'Kesehatan & Keselamatan',
    title: 'Sehat Selalu & Senantiasa Dilindungi',
    content: 'Semoga Allah SWT senantiasa menjaga kesehatanmu, melapangkan rizekimu, melindungimu dari segala keburukan, dan memberkahi setiap usahamu.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'w3',
    category: 'Cita-Cita & Masa Depan',
    title: 'Segala Impian Terwujud Indah',
    content: 'Semoga setiap doa dan cita-cita yang Laila impikan dapat dikabulkan di waktu terbaik. Jangan pernah ragu pada potensi luar biasa yang kamu miliki.',
    iconName: 'Sparkles'
  },
  {
    id: 'w4',
    category: 'Cinta & Kehadiran',
    title: 'Terima Kasih Sudah Hadir',
    content: 'Terima kasih telah hadir dan menjadi alasan tersenyum bagi orang-orang di sekitarmu. Kehadiranmu adalah hadiah terindah dalam hidup ini.',
    iconName: 'Heart'
  }
];

export const SPECIAL_REASONS: SpecialReason[] = [
  {
    id: 'r1',
    number: 1,
    title: 'Senyuman Manis Yang Menenangkan',
    detail: 'Setiap kali Laila tersenyum, rasanya semua rasa lelah dan beban seketika sirna begitu saja.',
    iconName: 'Sun'
  },
  {
    id: 'r2',
    number: 2,
    title: 'Hati Yang Sangat Tulus dan Baik',
    detail: 'Cara Laila peduli, memperhatikan, dan menyayangi orang lain menunjukkan betapa indahnya hatimu.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'r3',
    number: 3,
    title: 'Tingkah Gemoy Yang Selalu Bikin Gemas',
    detail: 'Ekspresi candid, pose lucu, dan kejujuran dirimu selalu berhasil membuat suasana makin ceria.',
    iconName: 'Sparkles'
  },
  {
    id: 'r4',
    number: 4,
    title: 'Sosok Pekerja Keras & Pantang Menyerah',
    detail: 'Keteguhan Laila saat mengejar cita-cita dan menjalani tugas adalah hal yang sangat membanggakan.',
    iconName: 'Award'
  },
  {
    id: 'r5',
    number: 5,
    title: 'Pendengar Terbaik di Setiap Suasana',
    detail: 'Laila selalu punya cara lembut untuk mendengarkan, memberi rasa aman, dan menghangatkan hati.',
    iconName: 'Coffee'
  },
  {
    id: 'r6',
    number: 6,
    title: 'Seseorang Yang Selalu Dirindukan',
    detail: 'Tidak pernah ada hari yang sepi bila ada Laila. Setiap detik bersamamu adalah kenangan yang tak ternilai.',
    iconName: 'Crown'
  }
];

export const LOVE_LETTER_TEXT = `Untuk Laila Nur Azizah Tercinta,

Selamat ulang tahun ya, sayang... 🤍

Hari ini adalah hari yang begitu istimewa, hari di mana sosok tersayang dilahirkan ke dunia untuk membawa kehangatan, keceriaan, dan kebahagiaan bagi banyak orang, terutama bagiku.

Melihat perjalananmu sejauh ini, aku begitu bangga pada setiap proses yang telah kamu lalui. Senyuman manis dari bibirmu, tatapan matamu yang hangat, dan hatimu yang tulus adalah alasan mengapa dunia ini terasa jauh lebih indah.

Di hari ulang tahunmu ini, doa tulusku menyertaimu:
Semoga Allah SWT senantiasa melimpahkan keberkahan, kesehatan, kemudahan dalam setiap urusanmu, dan melapangkan rizekimu. Semoga setiap impian dan cita-cita yang kamu simpan dalam sujudmu diijabah dengan cara yang paling indah.

Terima kasih ya sudah menjadi Laila Nur Azizah yang luar biasa, terimakasih sudah tumbuh menjadi pribadi yang penuh kasih sayang. Tetaplah menjadi dirimu yang hangat dan menginspirasi.

I'm so grateful to have you in my life.
Selamat Ulang Tahun, Laila! 🎉🎂🌹✨`;
