import { db } from "./firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query
} from "firebase/firestore";

// 📚 REALTIME CLASSES
export const listenToClasses = (callback) => {
  return onSnapshot(collection(db, "classes"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// 📝 REALTIME ASSIGNMENTS
export const listenToAssignments = (callback) => {
  return onSnapshot(collection(db, "assignments"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// 📤 REALTIME SUBMISSIONS
export const listenToSubmissions = (callback) => {
  return onSnapshot(collection(db, "submissions"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ➕ CREATE FUNCTIONS
export const createAssignment = async (data) => {
  await addDoc(collection(db, "assignments"), data);
};

export const createSubmission = async (data) => {
  await addDoc(collection(db, "submissions"), data);
};