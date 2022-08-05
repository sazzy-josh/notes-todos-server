const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const logger = require("../logger/appLogger");
const { EMAIL_USER, EMAIL_PASS } = require("../config");
const { apiStatus } = require("../services/httpResponseService");

class emailService {
  transporter = {};
  mailOptions = {};

  /**
   * The constructor function creates a transporter object that uses the nodemailer library to send
   * emails
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    this.transporter.use(
      "compile",
      hbs({
        viewEngine: "handlebars",
        extname: ".handlebars",
        defaultLayout: false,
        viewPath: path.resolve("./") + "/views",
      })
    );
  }

  /**
   * It sets up the mailOptions object that will be used to send the email
   */
  async setupMailOptions({
    subject,
    payload,
    message: text = null,
    template = null,
  }) {
    this.mailOptions = {
      from: EMAIL_USER,
      to: payload.email,
      subject,
      text,
      template,
      context: { ...payload },
    };
  }

  async sendMail(optionPayload, next) {
    /* Calling the setupMailOptions function and passing in the optionPayload object */
    await this.setupMailOptions(optionPayload);

    try {
      return await this.transporter.sendMail(this.mailOptions);
    } catch (error) {
      logger.error(error);
      next(apiStatus["internal"]());
      return false;
    }
  }
}

module.exports = new emailService();
