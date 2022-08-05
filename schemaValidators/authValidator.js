const validator = require("../services/validatorService");
const sanitize = require("../services/sanitizationService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");

/* A middleware function that is used to validate and sanitize the request body. */
const signupUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  /* VALIDATION SERVICE LAYER
   *******************************/
  validator.body(firstName, "firstname").required().minLength(2);
  validator.body(lastName, "lastname").required().minLength(2);
  validator.body(email, "email").required().email();
  validator.body(password, "password").required().minLength(6).strongPwd();
  validator.validationFailed(next);

  /* SANITIZATION SERVICE LAYER
   *********************************/
  req.body.firstName = sanitize.body(firstName).toTrim().toCase().body_data;
  req.body.lastName = sanitize.body(lastName).toTrim().toCase().body_data;
  req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
  req.body.password = await authService.hashPassword(password);
});

/* A middleware function that is used to validate and sanitize the request body. */
const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  /* VALIDATION SERVICE LAYER
   ********************************/
  validator.body(email, "email").required().email();
  validator.body(password, "password").required().minLength(6);
  validator.validationFailed(next);

  /* SANITIZATION SERVICE LAYER
   *********************************/
  req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
});

const requestUserPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  /* VALIDATION SERVICE LAYER
   ********************************/
  validator.body(email, "email").required().email();
  validator.validationFailed(next);

  /* SANITIZATION SERVICE LAYER
   *********************************/
  req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
});

const resetUserPassword = asyncWrapper(async (req, res, next) => {
  const { token, password } = req.body;

  /* VALIDATION SERVICE LAYER
   ********************************/
  validator.body(token, "token").required();
  validator.body(password, "password").required().minLength(6).strongPwd();
  validator.validationFailed(next);

  req.body = { token, password };
});

module.exports = {
  signupUser,
  loginUser,
  requestUserPassword,
  resetUserPassword,
};
