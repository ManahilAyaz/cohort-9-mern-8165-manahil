const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'Untitled note',
    },
    // this holds the rich text content - storing as a plain string since the
    // editor output (HTML/delta json, depending what we pick on the frontend)
    // can get fairly long, and Mongo doesn't care about length the way a
    // fixed VARCHAR would
    content: {
      type: String,
      default: '',
    },
    // reference to the owning user - this is Mongo's version of a foreign key
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
