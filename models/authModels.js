const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minLength: [3, "First name should be at least 3 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minLength: [3, "Last name should be at least 3 characters"],
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
  createAt: {
    type: Date,
    immutable: true,
    default: new Date(),
  },
});

const User = model("User", userSchema);

module.exports = User;
