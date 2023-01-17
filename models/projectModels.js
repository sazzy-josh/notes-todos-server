const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title should be at least 3 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
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
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    selectPopulatedPaths: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "projectId",
  count: true,
});

projectSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "projectId",
  count: true,
});

const Project = model("Project", projectSchema);

module.exports = Project;
