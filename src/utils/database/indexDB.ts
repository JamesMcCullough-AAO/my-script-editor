export type fileNameString = `script_${string}`;
export type tagIDString = `tag_${string}`;

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 2); // Update the version number

    request.onerror = () => {
      reject("Couldn't open IndexedDB.");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("scripts")) {
        db.createObjectStore("scripts", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("tags")) {
        db.createObjectStore("tags", { keyPath: "id" }); // Create a new object store for tags
      }
    };
  });
};

export const setItem = async (id: fileNameString, value: any) => {
  const db = await openDB();
  const transaction = db.transaction("scripts", "readwrite");
  const store = transaction.objectStore("scripts");
  const request = store.put({ id, ...value });

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

export const getItem = async (id: fileNameString) => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<any>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject();
  });
};

export const deleteItem = async (id: fileNameString) => {
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

export const ifItemExists = async (id: fileNameString) => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<boolean>((resolve, reject) => {
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject();
  });
};

export const renameItem = async (id: fileNameString, newID: fileNameString) => {
  const db = await openDB();
  const transaction = db.transaction("scripts", "readwrite");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      const data = request.result;
      data.id = newID;
      store.put(data);
      store.delete(id);
      resolve();
    };
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

export const getScriptIconColor = async (id: fileNameString) => {
  const db = await openDB();
  const transaction = db.transaction("scripts");
  const store = transaction.objectStore("scripts");
  const request = store.get(id);

  return new Promise<string>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result.color);
    request.onerror = () => reject();
  });
};

export const setTag = async (id: tagIDString, value: any) => {
  const db = await openDB();
  const transaction = db.transaction("tags", "readwrite");
  const store = transaction.objectStore("tags");
  const request = store.put({ id, ...value });

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

export const getTag = async (id: tagIDString) => {
  const db = await openDB();
  const transaction = db.transaction("tags");
  const store = transaction.objectStore("tags");
  const request = store.get(id);

  return new Promise<any>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject();
  });
};

export const deleteTag = async (id: tagIDString) => {
  const db = await openDB();
  const transaction = db.transaction("tags", "readwrite");
  const store = transaction.objectStore("tags");
  const request = store.delete(id);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};

export const getAllTags = async () => {
  const db = await openDB();
  const transaction = db.transaction("tags");
  const store = transaction.objectStore("tags");
  const request = store.getAll();

  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject();
  });
};

// You can continue adding deleteItem, getAllItems etc.
