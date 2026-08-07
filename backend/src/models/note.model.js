const mongoose=require("mongoose");

const noteSchema=new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Untitled note",
    },

    // note content
    content: {
      type: String,
      default: "",
    },

    // user who owns this note
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports=mongoose.model("Note", noteSchema);