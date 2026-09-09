import { FichadaProcesada } from '../types';

const DB_NAME = 'ControlFichadasDB';
const DB_VERSION = 1;
const STORE_FICHADAS = 'fichadas';
const STORE_CONFIG = 'config';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FICHADAS)) {
        db.createObjectStore(STORE_FICHADAS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CONFIG)) {
        db.createObjectStore(STORE_CONFIG, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const guardarFichadasLocal = async (fichadas: FichadaProcesada[]): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_FICHADAS, 'readwrite');
  const store = tx.objectStore(STORE_FICHADAS);

  await store.clear();

  for (const f of fichadas) {
    const item = {
      ...f,
      id: f.id || `${f.legajo}_${f.fecha}`,
    };
    store.put(item);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const obtenerFichadasLocal = async (): Promise<FichadaProcesada[]> => {
  const db = await openDB();
  const tx = db.transaction(STORE_FICHADAS, 'readonly');
  const store = tx.objectStore(STORE_FICHADAS);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as FichadaProcesada[]);
    };
    request.onerror = () => reject(request.error);
  });
};

export const actualizarFichadaLocal = async (fichada: FichadaProcesada): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_FICHADAS, 'readwrite');
  const store = tx.objectStore(STORE_FICHADAS);
  const item = {
    ...fichada,
    id: fichada.id || `${fichada.legajo}_${fichada.fecha}`,
  };
  store.put(item);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const limpiarFichadasLocal = async (): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_FICHADAS, 'readwrite');
  const store = tx.objectStore(STORE_FICHADAS);
  store.clear();

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
