import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import "../styles/Home.css";

import Navbar from "../components/Navbar";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Add / Update Note
  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isEditing) {
        await API.put(`/notes/${editingId}`, {
          title,
          content,
        });

        setEditingId(null);
        setIsEditing(false);
      } else {
        await API.post("/notes", {
          title,
          content,
        });
      }

      setTitle("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Search Filter
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="container">
        <SearchBar search={search} setSearch={setSearch} />

        <NoteForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          addNote={addNote}
          isEditing={isEditing}
        />

        <h2>📒 My Notes</h2>

        <p className="note-count">
          📝 Showing {filteredNotes.length} Notes
        </p>

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h1>📭</h1>
            <h2>No Notes Found</h2>
            <p>Create your first note.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              editNote={editNote}
              deleteNote={deleteNote}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Home;