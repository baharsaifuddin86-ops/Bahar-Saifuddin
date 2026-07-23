import { PhotoMemory } from '../types';

const DB_NAME = 'LailaMemoriesDB';
const STORE_MEMORIES = 'memories';
const STORE_SETTINGS = 'settings';
const DB_VERSION = 2;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_MEMORIES)) {
        db.createObjectStore(STORE_MEMORIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memory CRUD
export async function saveMemoriesToStorage(memories: PhotoMemory[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_MEMORIES, 'readwrite');
    const store = tx.objectStore(STORE_MEMORIES);
    
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
    console.warn('Gagal menyimpan ke IndexedDB:', e);
  }

  // Backup fallback to localStorage
  try {
    localStorage.setItem('laila_memories_data', JSON.stringify(memories));
  } catch (e) {
    console.warn('Quota localStorage terlampaui:', e);
  }
}

export async function loadMemoriesFromStorage(): Promise<PhotoMemory[] | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_MEMORIES, 'readonly');
    const store = tx.objectStore(STORE_MEMORIES);
    
    const result = await new Promise<PhotoMemory[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (result && result.length > 0) {
      return result;
    }
  } catch (e) {
    console.warn('Gagal membaca dari IndexedDB:', e);
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

// Settings (Banner, Music, etc.)
export async function saveSettingToStorage(key: string, value: string | null): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = tx.objectStore(STORE_SETTINGS);
    if (value === null) {
      store.delete(key);
    } else {
      store.put(value, key);
    }
  } catch (e) {
    console.warn(`Gagal menyimpan setting ${key} ke IndexedDB:`, e);
  }

  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`Gagal menyimpan setting ${key} ke localStorage:`, e);
  }
}

export async function loadSettingFromStorage(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SETTINGS, 'readonly');
    const store = tx.objectStore(STORE_SETTINGS);
    const result = await new Promise<string | null>((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
    if (result !== null) {
      return result;
    }
  } catch (e) {
    console.warn(`Gagal membaca setting ${key} dari IndexedDB:`, e);
  }

  return localStorage.getItem(key);
}
