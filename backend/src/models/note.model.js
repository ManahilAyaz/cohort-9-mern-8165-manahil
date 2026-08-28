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

    positionX: {
      type: Number,
      default: null,
    },

    positionY: {
      type: Number,
      default: null,
    },

    // user who owns this note
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    color: {
      type: String,
      default: 'yellow',
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  
  },
  {
    timestamps: true,
  }
);

module.exports=mongoose.model("Note", noteSchema);