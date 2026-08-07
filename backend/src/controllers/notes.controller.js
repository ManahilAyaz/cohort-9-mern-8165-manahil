const notesService=require("../services/notes.service");
const { catchAsync }=require("../middleware/errorHandler");
const AppError=require("../utils/appError");
const logger=require("../config/logger");

// get all notes
const getNotes=catchAsync(async (req, res)=>{

  const notes=await notesService.getAllNotes(req.user.id);

  res.status(200).json({
    success: true,
    results: notes.length,
    data: notes,
  });

});

// get one note
const getNote=catchAsync(async (req, res)=>{

  const note=await notesService.getNoteById(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: note,
  });

});

// create note
const createNote=catchAsync(async (req, res, next)=>{

  const title=req.body.title;
  const content=req.body.content;

  if (!content && !title) {
    return next(
      new AppError(
        "A note needs at least a title or some content.",
        400
      )
    );
  }

  const note=await notesService.createNote({
    title: title,
    content: content,
    userId: req.user.id,
  });

  logger.info(
    {
      noteId: note.id,
      userId: req.user.id,
    },
    "Note created"
  );

  res.status(201).json({
    success: true,
    data: note,
  });

});

// update note
const updateNote=catchAsync(async (req, res)=>{

  const title=req.body.title;
  const content=req.body.content;

  const note=await notesService.updateNote(
    req.params.id,
    req.user.id,
    {
      title: title,
      content: content,
    }
  );

  logger.info(
    {
      noteId: note.id,
      userId: req.user.id,
    },
    "Note updated"
  );

  res.status(200).json({
    success: true,
    data: note,
  });

});

// delete note
const deleteNote=catchAsync(async (req, res)=>{

  await notesService.deleteNote(
    req.params.id,
    req.user.id
  );

  logger.info(
    {
      noteId: req.params.id,
      userId: req.user.id,
    },
    "Note deleted"
  );

  res.status(204).json({
    success: true,
    data: null,
  });

});

module.exports={
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};