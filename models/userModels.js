const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name should be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Last name should be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    picture: {
      id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["admin", "regular"],
      default: "regular",
    },
    location: {
      type: Map,
      of: String,
    },
    archived: {
      type: Boolean,
      default: false,
      select: false,
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
  {
    timestamps: true,
    versionKey: false,
    selectPopulatedPaths: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.plugin(mongoosePaginate);

userSchema.statics.findOneByEmail = function (email) {
  return this.where({ email });
};

const User = model("User", userSchema);

module.exports = User;
