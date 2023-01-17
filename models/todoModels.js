const { Schema, model } = require("mongoose");

const todoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
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
    category: {
      type: String,
      enum: {
        values: ["backlog", "ongoing", "completed", "postponed"],
        message: "Enter a valid category",
      },
      default: "backlog",
    },
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Todo = model("Todo", todoSchema);

module.exports = Todo;
