const url = require("url");

// USER LOGIN CONTROLLER
const loginUser = (req, res) => {
  console.log(url.parse(req.url, true).query);
  console.log(req.query);
  res.json(req.body);
};

// USER SIGNUP CONTROLLER
const signupUser = (req, res) => {
  res.send("Signup route");
};

// USER PASSWORD REQUEST CONTROLLER
const requestUserPassword = (req, res) => {
  res.send("Password request route");
};

// USER PASSWORD RESET CONTROLLER
const resetUserPassword = (req, res) => {
  res.send("Password reset route");
};

// USER LOGOUT CONTROLLER
const logoutUser = (req, res) => {
  res.send("Logout route");
};

module.exports = {
  loginUser,
  signupUser,
  requestUserPassword,
  resetUserPassword,
  logoutUser,
};
