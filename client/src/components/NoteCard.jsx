function NoteCard({ note, editNote, deleteNote }) {
  const formattedDate = new Date(note.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>

        <span className="note-date">
          📅 {formattedDate}
        </span>
      </div>

      <p className="note-content">
        {note.content}
      </p>

      <div className="note-actions">
        <button
          className="edit-btn"
          onClick={() => editNote(note)}
        >
          ✏️ Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteNote(note._id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;