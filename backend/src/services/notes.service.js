const { Note }=require("../models");
const AppError=require("../utils/appError");

async function getAllNotes(userId) {
  const notes=await Note.find({ userId }).sort({ updatedAt: -1 });
  return notes;
}

// get one note
async function getNoteById(noteId, userId) {
  const note=await Note.findOne({
    _id: noteId,
    userId: userId,
  });

  if (!note) {
    throw new AppError("Note not found.", 404);
  }

  return note;
}

// create new note
async function createNote(data) {
  const note=await Note.create({
    title: data.title,
    content: data.content,
    userId: data.userId,
  });

  return note;
}

// update note
async function updateNote(noteId, userId, updates) {
  const note=await getNoteById(noteId, userId);

  if (updates.title!==undefined) {
    note.title=updates.title;
  }

  if (updates.content!==undefined) {
    note.content=updates.content;
  }

  await note.save();

  return note;
}

// delete note
async function deleteNote(noteId, userId) {
  const note=await getNoteById(noteId, userId);

  await note.deleteOne();
}

module.exports={
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};