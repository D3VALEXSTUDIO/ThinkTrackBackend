export default function HomePage({ goToLogin, goToRegister }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>ThinkTrack</h1>

      <button onClick={goToLogin}>Login</button>
      <button onClick={goToRegister}>Register</button>
    </div>
  );
}