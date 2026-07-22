const express = require("express");
const router = express.Router();

const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");

// GET all notes
router.get("/notes", getNotes);

// GET one note
router.get("/notes/:id", getNoteById);

// CREATE note
router.post("/notes", createNote);

// UPDATE note
router.put("/notes/:id", updateNote);

// DELETE note
router.delete("/notes/:id", deleteNote);

module.exports = router;