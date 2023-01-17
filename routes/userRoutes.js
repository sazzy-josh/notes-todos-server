const user = require("express").Router();
const userValidator = require("../schemaValidators/userValidator");
const authMiddleware = require("../middlewares/authMiddlewares");
const userController = require("../controllers/userControllers");

/* A middleware that checks if the user is authenticated. */
user.use(authMiddleware.isAuthUser);

/* This is a route that is used to fetch all the users. */
user.route("/").get(userValidator.validateAdminUser, userController.fetchUsers);

/* This is a route that is used to fetch the dashboard summary of a user. */
user.route("/dashboard-summary").get(userController.fetchDashboardSummary);

/* This is a route that is used to fetch a single user. */
user.route("/single/:id?").get(userController.fetchSingleUser);

/* This is a route that is used to update the role of a user. */
user
  .route("/role/:id")
  .put(
    userValidator.validateAdminUser,
    userValidator.validateUserId,
    userValidator.validateUserBodyRole,
    userController.updateUserRole
  );

/* This is a route that is used to update the details of a user and also remove a user. */
user
  .route("/:id?")
  .put(userValidator.validateUserBody, userController.updateUser)
  .delete(
    userValidator.validateAdminUser,
    userValidator.validateUserId,
    userController.removeUser
  );

module.exports = user;
