const auth = require("express").Router();

// CONTROLLERS
const authController = require("../controllers/authControllers");

auth.route("/login").post(authController.loginUser);
auth.route("/signup").post(authController.signupUser);
auth.route("/request-password").post(authController.requestUserPassword);
auth.route("/reset-password").post(authController.resetUserPassword);
auth.route("/logout").post(authController.logoutUser);

module.exports = auth;
