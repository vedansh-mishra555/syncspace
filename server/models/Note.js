const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content cannot be empty"],
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);