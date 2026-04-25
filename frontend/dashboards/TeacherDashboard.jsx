import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";

export default function TeacherDashboard({ logout }) {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [className, setClassName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [title, setTitle] = useState("");

  // 🏫 LOAD CLASSES
  useEffect(() => {
    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  // 📚 LOAD ASSIGNMENTS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "assignments"), (snap) => {
      setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  // 🏫 CREATE CLASS
  const createClass = async () => {
    await addDoc(collection(db, "classes"), {
      name: className,
      teacherId: auth.currentUser.uid,
      code: Math.random().toString(36).substring(2, 7).toUpperCase()
    });

    setClassName("");
  };

  // 📚 CREATE ASSIGNMENT
  const createAssignment = async () => {
    await addDoc(collection(db, "assignments"), {
      title,
      classId: selectedClass,
      teacherId: auth.currentUser.uid
    });

    setTitle("");
  };

  return (
    <div style={styles.page}>
      <h1>Teacher Dashboard</h1>

      <div style={styles.card}>
        <input value={className} onChange={e => setClassName(e.target.value)} />
        <button onClick={createClass}>Create Class</button>

        {classes.map(c => (
          <p key={c.id}>{c.name} ({c.code})</p>
        ))}
      </div>

      <div style={styles.card}>
        <select onChange={(e) => setSelectedClass(e.target.value)}>
          <option>Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input value={title} onChange={e => setTitle(e.target.value)} />
        <button onClick={createAssignment}>Create Assignment</button>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", color: "white", padding: 30 },
  card: { background: "#111c33", padding: 20, marginTop: 10 }
};