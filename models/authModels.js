const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
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
