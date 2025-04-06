const Note = require('../models/Note');
const User = require('../models/User');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const note = await Note.create({
      title,
      content,
      user: userId
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ user: userId }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};