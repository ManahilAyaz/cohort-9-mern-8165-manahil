const notesService=require("../services/notes.service");
const { catchAsync }=require("../middleware/errorHandler");
const AppError=require("../utils/appError");
const logger=require("../config/logger");

function isValidUpdate(body){
  if(body.title!==undefined && typeof body.title!=='string') return false
  if(body.content!==undefined && typeof body.content!=='string') return false
  if(body.color!==undefined && typeof body.color!=='string') return false
  if(body.favorite!==undefined && typeof body.favorite!=='boolean') return false
  if(body.positionX!==undefined && (typeof body.positionX!=='number' || !Number.isFinite(body.positionX) || body.positionX<0)) return false
  if(body.positionY!==undefined && (typeof body.positionY!=='number' || !Number.isFinite(body.positionY) || body.positionY<0)) return false
  return true
}

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
const updateNote=catchAsync(async (req,res,next)=>{

  if (!isValidUpdate(req.body)) {
    return next(new AppError("Invalid note data provided.", 400));
  }

  const title=req.body.title;
  const content=req.body.content;
  const positionX=req.body.positionX;
  const positionY=req.body.positionY;
  const color=req.body.color;
  const favorite=req.body.favorite;

  const note=await notesService.updateNote(
    req.params.id,
    req.user.id,
    {
      title: title,
      content: content,
      positionX: positionX,
      positionY: positionY,
      color: color,
      favorite: favorite,
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

  res.status(204).send();

});

module.exports={
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};