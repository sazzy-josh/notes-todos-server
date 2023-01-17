const validator = require("../services/validatorService");
const sanitize = require("../services/sanitizationService");
const authService = require("../services/authService");
const { apiStatus } = require("../services/httpResponseService");
const asyncWrapper = require("../utils/asyncWrapper");
const User = require("../models/userModels");

/* This is a middleware function that validates the user body. */
const validateUserBody = asyncWrapper(async (req, res, next) => {
  const { fullName } = req.body;
  const [firstName, lastName] = fullName.split(" ");
  const imageObj = req?.files?.image;

  /* VALIDATION SERVICE LAYER
   *******************************/
  validator.body(firstName, "firstname").required().minLength(2);
  validator.body(lastName, "lastname").required().minLength(2);
  validator
    .body(imageObj, "image")
    .fileSize(5 * 1024 * 1024)
    .fileType([".jpg", ".jpeg", ".png"]);

  validator.validationFailed(next);

  /* SANITIZATION SERVICE LAYER
   *********************************/
  req.body.firstName = sanitize.body(firstName).toTrim().toCase().body_data;
  req.body.lastName = sanitize.body(lastName).toTrim().toCase().body_data;
});

/* This is a middleware function that checks if the user role is allowed. */
const validateUserBodyRole = asyncWrapper(async (req, res, next) => {
  const { role } = req.body;
  const allowed_roles = ["admin", "regular"];

  allowed_roles.includes(role)
    ? next()
    : next(apiStatus.badRequest("Role is not allowed"));
});

/* This is a middleware function that checks if the user id exists in the database. */
const validateUserId = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user_exist = await User.findById(id);
  user_exist ? next() : next(apiStatus.badRequest("User id does not exist"));
});

/* This is a middleware function that checks if the user is an admin. */
const validateAdminUser = asyncWrapper(async (req, res, next) => {
  const userToken = req.headers["authorization"].split(" ")[1];
  const { role } = await authService.verifyToken(userToken);

  role === "admin"
    ? next()
    : next(apiStatus.badRequest("User is not authorized"));
});

module.exports = {
  validateUserBody,
  validateUserBodyRole,
  validateUserId,
  validateAdminUser,
};
