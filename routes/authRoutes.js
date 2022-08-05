const auth = require("express").Router();
const authValidator = require("../schemaValidators/authValidator");
const authMiddleware = require("../middlewares/authMiddlewares");

// CONTROLLERS
const authController = require("../controllers/authControllers");

/* This is a route that is being created for the signup route. The route is being created using the
`.route()` method. The `.post()` method is being used to specify the type of request that is being
made. The `authMiddleware.isGuestUser` is a middleware that is being used to check if the user is a
guest user. The `authValidator.signupUser` is a validator that is being used to validate the data
that is being sent to the server. The `authController.signupUser` is a controller that is being used
to handle the request. */
auth
  .route("/signup")
  .post(
    authMiddleware.isGuestUser,
    authValidator.signupUser,
    authController.signupUser
  );

auth
  .route("/login")
  .post(
    authMiddleware.isGuestUser,
    authValidator.loginUser,
    authController.loginUser
  );

auth
  .route("/request-password")
  .post(
    authMiddleware.isGuestUser,
    authValidator.requestUserPassword,
    authController.requestUserPassword
  );

auth
  .route("/reset-password")
  .post(
    authMiddleware.isGuestUser,
    authValidator.resetUserPassword,
    authController.resetUserPassword
  );

auth
  .route("/logout")
  .post(authMiddleware.isAuthUser, authController.logoutUser);

module.exports = auth;
