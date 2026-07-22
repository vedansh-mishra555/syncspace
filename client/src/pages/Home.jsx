import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        console.log("Fetching notes...");

        const response = await API.get("/notes");

        console.log("Received:", response.data);

        setNotes(response.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>📝 SyncSpace</h1>

      <h2>My Notes</h2>

      <p>Total Notes: {notes.length}</p>

      <pre>{JSON.stringify(notes, null, 2)}</pre>

      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;