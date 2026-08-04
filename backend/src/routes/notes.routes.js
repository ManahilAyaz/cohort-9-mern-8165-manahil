const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/notes.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

// every note route requires a logged-in user
router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNote).patch(updateNote).delete(deleteNote);

module.exports = router;
