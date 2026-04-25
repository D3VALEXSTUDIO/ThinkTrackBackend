import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  onSnapshot
} from "firebase/firestore";

// 📚 ASSIGNMENTS (REALTIME)
export const listenAssignments = (cb) => {
  return onSnapshot(collection(db, "assignments"), (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// 📤 SUBMIT ASSIGNMENT
export const submitAssignment = async (data) => {
  return await addDoc(collection(db, "submissions"), {
    ...data,
    studentId: auth.currentUser.uid,
    createdAt: Date.now()
  });
};

// 🧠 UPDATE SKILLS
export const saveSkills = async (skills) => {
  const ref = doc(db, "users", auth.currentUser.uid);

  await updateDoc(ref, {
    skills
  });
};

// 📥 GET USER DATA
export const getUserData = async () => {
  const ref = doc(db, "users", auth.currentUser.uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};