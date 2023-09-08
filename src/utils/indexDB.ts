const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);

    request.onerror = () => {
      reject("Couldn't open IndexedDB.");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("scripts", { keyPath: "id" });
    };
  });
};

export const setItem = async (id: string, value: any) => {
  const db = await openDB();
  const transaction = db.transaction("scripts", "readwrite");
  const store = transaction.objectStore("scripts");
  const request = store.put({ id, ...value });

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

export const getItem = async (id: string) => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<any>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject();
  });
};

export const deleteItem = async (id: string) => {
  const db = await openDB();
  const transaction = db.transaction("scripts", "readwrite");
  const store = transaction.objectStore("scripts");
  const request = store.delete(id);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

export const getAllItems = async () => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.getAll();

  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject();
  });
};

export const ifItemExists = async (id: string) => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<boolean>((resolve, reject) => {
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject();
  });
};

export const deleteAllItems = async () => {
  const db = await openDB();
  const transaction = db.transaction("scripts", "readwrite");
  const store = transaction.objectStore("scripts");
  const request = store.clear();

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

// You can continue adding deleteItem, getAllItems etc.
