import { useState } from "react";
import { loginUser } from "./authService";

export default function LoginPage({ setUser, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);

      setUser(user);
      setRole(user.role);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" onChange={(e)=>setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}