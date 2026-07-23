import { PhotoMemory } from '../types';

const DB_NAME = 'LailaMemoriesDB';
const STORE_NAME = 'memories';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMemoriesToStorage(memories: PhotoMemory[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        if (memories.length === 0) {
          resolve();
          return;
        }
        let pending = memories.length;
        memories.forEach((mem) => {
          const addReq = store.put(mem);
          addReq.onsuccess = () => {
            pending--;
            if (pending === 0) resolve();
          };
          addReq.onerror = () => reject(addReq.error);
        });
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch (e) {
    console.warn('Gagal menyimpan ke IndexedDB, menggunakan localStorage fallback:', e);
  }

  // Backup fallback to localStorage
  try {
    localStorage.setItem('laila_memories_data', JSON.stringify(memories));
  } catch (e) {
    console.warn('Quota localStorage terlampaui, data disimpan via IndexedDB:', e);
  }
}

export async function loadMemoriesFromStorage(): Promise<PhotoMemory[] | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const result = await new Promise<PhotoMemory[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (result && result.length > 0) {
      return result;
    }
  } catch (e) {
    console.warn('Gagal membaca dari IndexedDB, menggunakan localStorage fallback:', e);
  }

  const saved = localStorage.getItem('laila_memories_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}
