const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/notes');
const { protect } = require('../middleware/auth');

// Protect all note routes
router.use(protect);

// Note routes
router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;