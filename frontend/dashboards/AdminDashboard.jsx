import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot
} from "firebase/firestore";

export default function AdminDashboard({ logout }) {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // 📡 LIVE DATA
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => d.data()));
    });

    const unsubAssignments = onSnapshot(collection(db, "assignments"), (snap) => {
      setAssignments(snap.docs.map(d => d.data()));
    });

    return () => {
      unsubUsers();
      unsubAssignments();
    };
  }, []);

  // 🧠 COUNTS
  const teachers = users.filter(u => u.role === "teacher").length;
  const students = users.filter(u => u.role === "student").length;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Panel</h1>
      <p style={styles.subtitle}>System overview (live)</p>

      <div style={styles.grid}>
        <div style={styles.card}>Users: {users.length}</div>
        <div style={styles.card}>Teachers: {teachers}</div>
        <div style={styles.card}>Students: {students}</div>
        <div style={styles.card}>Assignments: {assignments.length}</div>
      </div>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}