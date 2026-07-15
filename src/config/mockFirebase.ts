// A complete mock of Firebase Auth and Firestore using localStorage
// This allows the app to function identically to Firebase without needing an actual backend.

export const auth = {};
export const db = {};

// Auth Mocks
export const createUserWithEmailAndPassword = async (_authObj: any, email: string, pass: string) => {
  const users = JSON.parse(localStorage.getItem('mock_firebase_auth_users') || '{}');
  const uid = 'user_' + Math.random().toString(36).substr(2, 9);
  if (Object.values(users).some((u: any) => u.email === email)) {
    throw new Error("Email already in use");
  }
  users[uid] = { uid, email, pass };
  localStorage.setItem('mock_firebase_auth_users', JSON.stringify(users));
  return { user: { uid, email } };
};

export const signInWithEmailAndPassword = async (_authObj: any, email: string, pass: string) => {
  const users = JSON.parse(localStorage.getItem('mock_firebase_auth_users') || '{}');
  const user = Object.values(users).find((u: any) => u.email === email && u.pass === pass) as any;
  if (!user) throw new Error("Invalid email or password");
  return { user };
};

export const signOut = async (_authObj: any) => {
  return true;
};

// Firestore Mocks
export const doc = (_dbObj: any, collectionName: string, id: string) => {
  return { collectionName, id };
};

export const setDoc = async (docRef: any, data: any) => {
  const dbData = JSON.parse(localStorage.getItem('mock_firestore_' + docRef.collectionName) || '{}');
  dbData[docRef.id] = data;
  localStorage.setItem('mock_firestore_' + docRef.collectionName, JSON.stringify(dbData));
};

export const getDoc = async (docRef: any) => {
  const dbData = JSON.parse(localStorage.getItem('mock_firestore_' + docRef.collectionName) || '{}');
  const data = dbData[docRef.id];
  return {
    exists: () => !!data,
    data: () => data
  };
};

export const deleteDoc = async (docRef: any) => {
  const dbData = JSON.parse(localStorage.getItem('mock_firestore_' + docRef.collectionName) || '{}');
  if (dbData[docRef.id]) {
    delete dbData[docRef.id];
    localStorage.setItem('mock_firestore_' + docRef.collectionName, JSON.stringify(dbData));
  }
};

export const collection = (_dbObj: any, collectionName: string) => {
  return { collectionName };
};

export const addDoc = async (collRef: any, data: any) => {
  const id = 'doc_' + Math.random().toString(36).substr(2, 9);
  await setDoc(doc(db, collRef.collectionName, id), data);
  return { id };
};

export const query = (collRef: any, ...constraints: any[]) => {
  return { collRef, constraints };
};

export const where = (field: string, op: string, value: any) => {
  return { field, op, value };
};

export const getDocs = async (queryObj: any) => {
  const collName = queryObj.collRef.collectionName;
  const dbData = JSON.parse(localStorage.getItem('mock_firestore_' + collName) || '{}');
  let results = Object.keys(dbData).map(key => ({ id: key, data: dbData[key] }));
  
  if (queryObj.constraints) {
    queryObj.constraints.forEach((c: any) => {
      if (c.op === '==') {
        results = results.filter(r => r.data[c.field] === c.value);
      }
    });
  }

  const mappedResults = results.map(r => ({
    id: r.id,
    data: () => {
      // Restore dates if they exist
      const d = r.data;
      if (d.timestamp && d.timestamp.isMockDate) {
        d.timestamp = {
          toDate: () => new Date(d.timestamp.val),
          toMillis: () => new Date(d.timestamp.val).getTime()
        };
      }
      return d;
    }
  }));

  return {
    empty: mappedResults.length === 0,
    docs: mappedResults,
    forEach: (cb: any) => {
      mappedResults.forEach(cb);
    }
  };
};

export const serverTimestamp = () => {
  const now = new Date();
  return {
    isMockDate: true,
    val: now.toISOString(),
    toMillis: () => now.getTime(),
    toDate: () => now
  };
};

// IndexedDB Mocks for File Storage
export const saveFileToDB = async (id: string, file: File) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VideoDB', 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore('videos');
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('videos', 'readwrite');
      tx.objectStore('videos').put(file, id);
      tx.oncomplete = () => resolve(true);
    };
    request.onerror = reject;
  });
};

export const getFileFromDB = async (id: string): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('VideoDB', 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore('videos');
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        resolve(null);
        return;
      }
      const tx = db.transaction('videos', 'readonly');
      const getReq = tx.objectStore('videos').get(id);
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => resolve(null);
    };
    request.onerror = () => resolve(null);
  });
};
