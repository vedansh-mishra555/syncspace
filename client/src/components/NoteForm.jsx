function NoteForm({
  title,
  setTitle,
  content,
  setContent,
  addNote,
  isEditing,
}) {
  return (
    <div className="form">
      <h2>{isEditing ? "Edit Note" : "Add Note"}</h2>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Enter Content"
        rows="5"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <p
  style={{
    textAlign: "right",
    color: "#666",
    marginTop: "-5px",
    marginBottom: "15px",
  }}
>
  {content.length}/500 Characters
</p>

      <button onClick={addNote}>
        {isEditing ? "Update Note" : "Add Note"}
      </button>
    </div>
  );
}

export default NoteForm;