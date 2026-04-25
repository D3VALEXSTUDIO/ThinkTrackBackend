import { db, auth } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// 🏫 JOIN CLASS (SECURE)
export const joinClass = async (code) => {
  const q = query(collection(db, "classes"), where("code", "==", code));
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("Invalid class code");

  const classData = snap.docs[0];

  await addDoc(collection(db, "enrollments"), {
    classId: classData.id,
    studentId: auth.currentUser.uid,
    teacherId: classData.data().teacherId
  });

  return classData.id;
};