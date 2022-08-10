const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Content is required"],
    },
    labels: [
      {
        title: String,
        color: String,
      },
    ],
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const Note = model("Note", noteSchema);

module.exports = Note;
