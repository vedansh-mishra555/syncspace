import "../styles/Sidebar.css";

function Sidebar({ room, name, users }) {
  return (
    <div className="sidebar">

      <h2>👥 Participants</h2>

      <hr />

      <div className="room-info">
        <p><strong>Room</strong></p>
        <span>{room}</span>

        <p><strong>You</strong></p>
        <span>{name}</span>
      </div>

      <hr />

      <div className="users-list">

        {users.length === 0 ? (
          <p className="no-users">No users connected.</p>
        ) : (
          users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="online-dot"></div>

              <span>{user.name}</span>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Sidebar;