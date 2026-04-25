import { auth, db } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

// 📝 REGISTER USER
export const registerUser = async (email, password, role) => {
  const userCred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    createdAt: Date.now()
  });

  return { uid: user.uid, email, role };
};

// 🔐 LOGIN USER
export const loginUser = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCred.user;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) {
    throw new Error("User profile not found");
  }

  return {
    uid: user.uid,
    email: snap.data().email,
    role: snap.data().role
  };
};