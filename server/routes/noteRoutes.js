const express = require("express");
const router = express.Router();

const {
    getNotes,
    createNote,
} = require("../controllers/noteController");

router.get("/notes", getNotes);

router.post("/notes", createNote);

module.exports = router;