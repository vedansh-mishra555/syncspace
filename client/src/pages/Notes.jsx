import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Notes.css";

function Notes() {
  // ============================
  // STATES
  // ============================
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:5000/api";

  // ============================
  // GET ALL NOTES
  // ============================
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);

      toast.error("Failed to load notes");
    }
  };

  // ============================
  // LOAD NOTES WHEN PAGE OPENS
  // ============================
  useEffect(() => {
    fetchNotes();
  }, []);

  // ============================
  // CREATE / UPDATE NOTE
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!title.trim() || !content.trim()) {
      toast.warning("Please enter title and content");
      return;
    }

    try {
      // ============================
      // UPDATE
      // ============================
      if (editingId) {
        await axios.put(`${API_URL}/notes/${editingId}`, {
          title,
          content,
        });

        toast.success("Note updated successfully!");
      }

      // ============================
      // CREATE
      // ============================
      else {
        await axios.post(`${API_URL}/notes`, {
          title,
          content,
        });

        toast.success("Note created successfully!");
      }

      // Clear form
      setTitle("");
      setContent("");
      setEditingId(null);

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);

      toast.error("Something went wrong");
    }
  };

  // ============================
  // EDIT NOTE
  // ============================
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);

    setEditingId(note._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // DELETE NOTE
  // ============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/notes/${id}`);

      toast.success("Note deleted successfully!");

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);

      toast.error("Failed to delete note");
    }
  };

  // ============================
  // CANCEL EDIT
  // ============================
  const cancelEdit = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  // ============================
  // SEARCH NOTES
  // ============================
  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  // ============================
  // RETURN
  // ============================
  return (
    <div className="notes-page">

      {/* ============================
          HEADER
      ============================ */}
      <div className="notes-header">
        <h1>📝 SyncSpace Notes</h1>

        <p>
          Take and manage your meeting notes in one place.
        </p>
      </div>

      {/* ============================
          NOTE FORM
      ============================ */}
      <div className="note-form-card">

        <h2>
          {editingId
            ? "✏️ Edit Note"
            : "➕ Create Note"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* CONTENT */}
          <textarea
            placeholder="Write your meeting notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
          />

          {/* BUTTONS */}
          <div className="note-form-buttons">

            <button
              type="submit"
              className="save-note-btn"
            >
              {editingId
                ? "💾 Update Note"
                : "💾 Save Note"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-note-btn"
                onClick={cancelEdit}
              >
                ❌ Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* ============================
          NOTES LIST
      ============================ */}
      <div className="notes-list">

        {/* NOTES TITLE + COUNT */}
        <h2>
          📚 Your Notes ({filteredNotes.length})
        </h2>

        {/* ============================
            SEARCH BOX
        ============================ */}
        <input
          type="text"
          className="search-notes"
          placeholder="🔍 Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ============================
            EMPTY / NOTES
        ============================ */}
        {filteredNotes.length === 0 ? (

          <div className="empty-notes">

            {notes.length === 0 ? (
              <>
                <p>📝 No notes yet.</p>

                <p>
                  Create your first meeting note above.
                </p>
              </>
            ) : (
              <p>
                🔍 No notes found for "{search}"
              </p>
            )}

          </div>

        ) : (

          filteredNotes.map((note) => (

            <div
              className="note-card"
              key={note._id}
            >

              {/* ============================
                  NOTE HEADER
              ============================ */}
              <div className="note-card-header">

                <h3>
                  {note.title}
                </h3>

                <div className="note-actions">

                  {/* EDIT */}
                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(note)
                    }
                  >
                    ✏️ Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(note._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

              {/* ============================
                  NOTE CONTENT
              ============================ */}
              <p className="note-content">
                {note.content}
              </p>

              {/* ============================
                  CREATED DATE
              ============================ */}
              <small>
                Created:{" "}
                {new Date(
                  note.createdAt
                ).toLocaleString()}
              </small>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Notes;