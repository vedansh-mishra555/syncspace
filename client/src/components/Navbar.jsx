import "../styles/Navbar.css";

function Navbar({ room, name }) {
  return (
    <div className="navbar">

      <div className="navbar-left">
        🚀 <span>SyncSpace</span>
      </div>

      <div className="navbar-center">
        Room: <strong>{room}</strong>
      </div>

      <div className="navbar-right">
        👤 {name}
      </div>

    </div>
  );
}

export default Navbar;