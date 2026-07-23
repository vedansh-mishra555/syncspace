import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
     <div style={{ textAlign: "center" }}>
  <h1 className="logo">📝 SyncSpace</h1>

  <p
    style={{
      margin: 0,
      opacity: 0.9,
      fontSize: "14px",
    }}
  >
    Your Personal Notes App
  </p>
</div>
    </nav>
  );
}

export default Navbar;