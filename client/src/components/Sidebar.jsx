import "../styles/Sidebar.css";

function Sidebar({ room, name, users }) {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">👥 Participants</h2>

      <hr />

      <div className="room-info">
        <h3>Room</h3>
        <p>{room}</p>
      </div>

      <div className="user-info">
        <h3>You</h3>
        <p>{name}</p>
      </div>

      <hr />

      <div className="participants-list">
        <h3>Connected Users</h3>

        {users && users.length > 0 ? (
          users.map((user) => (
            <div className="participant" key={user.id}>
              🟢 {user.name}
            </div>
          ))
        ) : (
          <p>No users connected.</p>
        )}
      </div>

    </div>
  );
}

export default Sidebar;