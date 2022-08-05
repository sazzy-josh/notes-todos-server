/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { DOMAIN_URL } = require("../config");
const { apiStatus, respondWith } = require("../services/httpResponseService");
const { redisClient } = require("../config/redisDB");
const authService = require("../services/authService");
const emailService = require("../services/emailService");

const User = require("../models/userModels");
const asyncWrapper = require("../utils/asyncWrapper");

/***********************************************************
 *  This is a controller that handles user signup.
 **********************************************************/
const signupUser = asyncWrapper(async (req, res, next) => {
  /* Checking if the email already exist in the database. */
  if (await authService.checkEmailExist(req.body.email)) {
    next(apiStatus.badRequest(`${req.body.email} already exist!`));
    return false;
  }

  /* Creating a new user and generating a token for the user. */
  const user_data = await User.create({ ...req.body });
  const response_payload = await authService.generateSignedAuthPayload(
    user_data
  );
  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User created successfully",
    data: response_payload,
  });
});

/***********************************************************
 *  This is a controller that handles the login of a user.
 **********************************************************/
const loginUser = asyncWrapper(async (req, res, next) => {
  const response_payload = await authService.validateUserSignIn(
    req.body.email,
    req.body.password,
    next
  );

  if (!response_payload) return false;

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User logged in successfully!",
    data: response_payload,
  });
});

/************************************************************
 *  This is a controller that handles user password request
 ************************************************************/
const requestUserPassword = asyncWrapper(async (req, res, next) => {
  /* Checking if the email exist in the database. */
  let user_payload = await authService.checkEmailExist(req.body.email, false);

  /* If email exist, it will send a password reset link to the email. */
  if (await user_payload.length) {
    let { firstName, email } = user_payload[0];
    let signed = await authService.signToken({ email }, "5m");

    /* Creating a payload object that will be used to send an email to the user. */
    let payload = {
      email,
      firstName,
      resetLink: `${DOMAIN_URL}/reset-password/${signed}`,
    };

    let email_response = await emailService.sendMail(
      {
        subject: "Nothy - Password Reset",
        payload,
        template: "reset",
      },
      next
    );

    return email_response
      ? respondWith(res, apiStatus.success(), {
          message: "Password reset link sent to email",
        })
      : false;
  } else {
    /* Email does not exist in database */
    next(apiStatus.conflict(`${req.body.email} does not exist!`));
    return false;
  }
});

/************************************************************
 *  This is a controller that handles user password reset
 ************************************************************/
const resetUserPassword = asyncWrapper(async (req, res, next) => {
  /* Confirm if token is still valid */
  let verified_payload = await authService.verifyToken(req.body.token);

  if (verified_payload !== "jwt expired") {
    let user_payload = await User.findOne({ email: verified_payload?.email });

    /* Updating the user password with the new password. */
    user_payload.password = await authService.hashPassword(req.body.password);
    await user_payload.save();

    respondWith(res, apiStatus.success(), {
      message: "Password has been updated successfully",
    });
  } else {
    respondWith(
      res,
      apiStatus.unauthorized("Reset token is either invalid or expired")
    );
  }
});

/************************************************************
 *  This is a controller that handles user logout
 ************************************************************/
const logoutUser = asyncWrapper(async (req, res, next) => {
  const { ttl, token } = req.payload;

  // ADD USER TO BLACKLIST CACHE
  await redisClient.setEx(`black-list-${token}`, ttl, "true");

  respondWith(res, apiStatus.success(), {
    message: "User logout was successful",
  });
});

module.exports = {
  loginUser,
  signupUser,
  requestUserPassword,
  resetUserPassword,
  logoutUser,
};
