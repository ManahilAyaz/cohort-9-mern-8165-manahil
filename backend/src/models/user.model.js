const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
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
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },

    // store hashed password
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// delete user's notes when user is deleted
userSchema.pre("findOneAndDelete", async function (next) {

  try {

    const Note=require("./note.model");

    const user=await this.model.findOne(
      this.getQuery()
    );

    if (user) {
      await Note.deleteMany({
        userId: user._id,
      });
    }

    next();

  } catch (err) {
    next(err);
  }

});

module.exports=mongoose.model("User", userSchema);