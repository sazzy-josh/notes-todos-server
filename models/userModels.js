const { Schema, model } = require("mongoose");

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
    },
    picture: {
      type: String,
    },
    location: {
      type: Map,
      of: String,
    },
    archived: {
      type: Boolean,
      default: false,
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

userSchema.statics.findOneByEmail = function (email) {
  return this.where({ email });
};

// userSchema.pre

const User = model("User", userSchema);

module.exports = User;
