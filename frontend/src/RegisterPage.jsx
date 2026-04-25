import { useState } from "react";
import { registerUser } from "./authService";

export default function RegisterPage({ setUser, setRole, goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password, role);

      setUser(user);
      setRole(user.role);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

      <select onChange={(e)=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <button onClick={handleRegister}>Create Account</button>

      <button onClick={goToLogin}>Go to Login</button>
    </div>
  );
}