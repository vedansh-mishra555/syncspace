import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Load notes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Add Note
  const addNote = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/notes", {
        title,
        content,
      });

      // Clear input fields
      setTitle("");
      setContent("");

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📝 SyncSpace</h1>

      <h2>Add Note</h2>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Enter Content"
        rows="5"
        cols="40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addNote}>Add Note</button>

      <hr />

      <h2>My Notes</h2>

      <p>Total Notes: {notes.length}</p>

      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Home;