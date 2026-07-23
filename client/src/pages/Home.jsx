import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Load notes on page load
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Add or Update Note
  const addNote = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isEditing) {
        // Update existing note
        await API.put(`/notes/${editingId}`, {
          title,
          content,
        });

        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new note
        await API.post("/notes", {
          title,
          content,
        });
      }

      // Clear form
      setTitle("");
      setContent("");

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);

    setEditingId(note._id);
    setIsEditing(true);
  };

  return (
    <div className="container">
      <h1>📝 SyncSpace</h1>

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

        <button onClick={addNote}>
          {isEditing ? "Update Note" : "Add Note"}
        </button>
      </div>

      <h2>My Notes</h2>

      <p>Total Notes: {notes.length}</p>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note) => (
          <div className="note-card" key={note._id}>
            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => editNote(note)}
                style={{
                  backgroundColor: "orange",
                  color: "white",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteNote(note._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;