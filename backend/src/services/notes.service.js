const { Note } = require('../models');
const AppError = require('../utils/appError');

async function getAllNotes(userId) {
  return Note.find({ userId }).sort({ updatedAt: -1 });
}

async function getNoteById(noteId, userId) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw new AppError('Note not found.', 404);
  }
  return note;
}

async function createNote({ title, content, userId }) {
  return Note.create({ title, content, userId });
}

async function updateNote(noteId, userId, updates) {
  // reusing getNoteById here so the "does this note belong to this user" check
  // only lives in one place
  const note = await getNoteById(noteId, userId);

  if (updates.title !== undefined) note.title = updates.title;
  if (updates.content !== undefined) note.content = updates.content;

  await note.save();
  return note;
}

async function deleteNote(noteId, userId) {
  const note = await getNoteById(noteId, userId);
  await note.deleteOne();
}

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
