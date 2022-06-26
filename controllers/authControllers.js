const {
  httpResponse: apiStatus,
  responsePayload: respondWith,
} = require("../services/httpResponseService");

// USER LOGIN CONTROLLER
const loginUser = (req, res) => {
  respondWith(res, apiStatus.success(), {
    description: "User data has been created successfully!",
    data: req.body,
  });
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
