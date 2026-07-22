const Note = require("../models/Note");

// GET all notes
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// GET single note
const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// CREATE new note
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = await Note.create({
            title,
            content,
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// UPDATE note
const updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// DELETE note
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json({
            message: "Note deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
};