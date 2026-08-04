const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // storing the bcrypt hash here, never the plain password
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // gives us createdAt / updatedAt automatically
  }
);

// mongo has no built-in "ON DELETE CASCADE" like mysql did, so we clean up
// a user's notes ourselves whenever a user gets deleted this way
userSchema.pre('findOneAndDelete', async function (next) {
  const Note = require('./note.model');
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    await Note.deleteMany({ userId: user._id });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
