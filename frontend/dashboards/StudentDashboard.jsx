import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { joinClass } from "../firebaseClass";
import { submitAssignment, saveSkills, getUserData } from "../firebaseStudent";

export default function StudentDashboard({ logout }) {
  const [classCode, setClassCode] = useState("");
  const [studentClassIds, setStudentClassIds] = useState([]);

  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");

  const [skills, setSkills] = useState({
    logic: 50,
    writing: 50,
    problemSolving: 50,
    coding: 50
  });

  // 🧠 LOAD USER
  useEffect(() => {
    const load = async () => {
      const data = await getUserData();
      if (data?.skills) setSkills(data.skills);
    };
    load();
  }, []);

  // 🏫 ENROLLMENTS (REAL ACCESS CONTROL)
  useEffect(() => {
    const q = query(
      collection(db, "enrollments"),
      where("studentId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setStudentClassIds(snap.docs.map(d => d.data().classId));
    });

    return () => unsub();
  }, []);

  // 📚 ASSIGNMENTS (FILTERED BY CLASS ACCESS)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "assignments"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignments(all);
    });

    return () => unsub();
  }, []);

  const filtered = assignments.filter(a =>
    studentClassIds.includes(a.classId)
  );

  // 🏫 JOIN CLASS
  const join = async () => {
    try {
      await joinClass(classCode);
      setClassCode("");
      alert("Joined class");
    } catch (e) {
      alert(e.message);
    }
  };

  // 📤 SUBMIT
  const submit = async (id) => {
    await submitAssignment({
      assignmentId: id,
      classId: selected.classId,
      teacherId: selected.teacherId,
      studentId: auth.currentUser.uid,
      answer,
      grade: null,
      feedback: ""
    });

    setAnswer("");
    setSelected(null);
  };

  return (
    <div style={styles.page}>
      <h1>Student Dashboard</h1>

      {/* JOIN CLASS */}
      <div style={styles.card}>
        <h2>Join Class</h2>

        <input
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          style={styles.input}
        />

        <button onClick={join} style={styles.btn}>
          Join
        </button>
      </div>

      {/* ASSIGNMENTS */}
      {filtered.map(a => (
        <div key={a.id} style={styles.card}>
          <h3>{a.title}</h3>
          <button onClick={() => setSelected(a)}>
            Open
          </button>
        </div>
      ))}

      {/* SUBMIT */}
      {selected && (
        <div style={styles.card}>
          <h2>{selected.title}</h2>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={styles.input}
          />

          <button onClick={() => submit(selected.id)}>
            Submit
          </button>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", color: "white", padding: 30 },
  card: { background: "#111c33", padding: 20, marginTop: 10 },
  input: { width: "100%", marginTop: 10, padding: 10 }
};