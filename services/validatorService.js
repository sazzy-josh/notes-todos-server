const { apiStatus } = require("./httpResponseService");
const path = require("path");

class ValidatorService {
  body_field = "";
  body_payload = "";
  server_response = "";
  error_messages = [];

  #email_regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  #phone_regex = /(^[0]\d{10}$)|(^[\+]?[234]\d{12}$)/;
  #strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  #mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );

  /**
   * It sets the body_payload and body_field variables to the inputValue and fieldValue parameters.
   * @param inputValue - The value of the input field.
   * @param fieldValue - The field name of the field you want to search for.
   * @returns The object itself.
   */
  body(inputValue, fieldValue) {
    this.body_payload = inputValue;
    this.body_field = fieldValue;
    return this;
  }

  /**
   * If the request is invalid, respond with a 400 Bad Request error and the first error message
   * @returns The validate method is being returned.
   */
  validate(next) {
    let error_msg = this.error_messages[0];
    this.error_messages = [];

    next(apiStatus.badRequest(error_msg));
    return true;
  }

  /**
   * If there are any error messages, validate the form
   * @returns The error messages array.
   */
  validationFailed(next) {
    return this.error_messages.length ? this.validate(next) : next();
  }

  /**
   * It checks if the input is valid and if it is not valid, it pushes the invalid message to the
   * error_messages array.
   * @param is_valid - a boolean value that determines if the input is valid or not
   * @param invalid_msg - The message to display if the field is invalid.
   * @returns The object itself.
   */
  checkIfValid(is_valid, invalid_msg) {
    if (is_valid === false) this.error_messages.push(invalid_msg);
    return this;
  }

  /**
   * `isRequired()` checks if the `body_payload` is present and returns a boolean value
   * @returns The return value is a boolean.
   */
  required() {
    let required = this.body_payload ? true : false;
    return this.checkIfValid(required, `${this.body_field} is required`);
  }

  /**
   * It checks if the body_payload is an array and if it is, it checks if it's empty
   * @returns The return value of the checkIfValid function.
   */
  notEmpty() {
    if (Array.isArray(this.body_payload)) {
      let is_not_empty = this.body_payload.length ? true : false;
      return this.checkIfValid(is_not_empty, `${this.body_field} is empty`);
    } else
      return this.checkIfValid(false, `${this.body_field} is not an array`);
  }

  /**
   * It checks if the value of the body field is one of the allowed items
   * @param [allowed_items] - An array of allowed items.
   * @returns A boolean value
   */
  containsOne(allowed_items = []) {
    const contains_one = allowed_items.includes(this.body_payload);
    return this.checkIfValid(
      contains_one,
      `${this.body_payload} is not a valid ${this.body_field} item`
    );
  }

  /**
   * It checks if the body payload is a valid email address
   * @returns The return value is a boolean.
   */
  email() {
    let is_email = this.#email_regex.test(
      String(this.body_payload).toLowerCase()
    );

    return this.checkIfValid(
      is_email,
      `${this.body_payload} is not valid email`
    );
  }

  /**
   * It checks if the length of the body_payload is greater than or equal to the min_length.
   * @param min_length - The minimum length of the body field
   * @returns The return value is a boolean.
   */
  minLength(min_length) {
    let is_min_length = this.body_payload?.length >= min_length;
    return this.checkIfValid(
      is_min_length,
      `${this.body_field} is less than ${min_length} characters`
    );
  }

  /**
   * It checks if the length of the body_payload is greater than the max_length.
   * @param max_length - The maximum length of the field
   * @returns The return value is a boolean.
   */
  maxLength(max_length) {
    let is_max_length = max_length > this.body_payload?.length;
    return this.checkIfValid(
      is_max_length,
      `${this.body_field} is greater than ${max_length} characters`
    );
  }

  /**
   * It checks if the password provided is strong or medium
   * @returns The return value is a boolean value.
   */
  strongPwd() {
    let is_strong_pwd =
      this.#strongPassword.test(this.body_payload) ||
      this.#mediumPassword.test(this.body_payload);

    return this.checkIfValid(
      is_strong_pwd,
      `${this.body_field} provided is weak`
    );
  }

  /**
   * It checks if the number of words in the body field is equal to the number of words passed in as an
   * argument
   * @param count - The number of words the body should contain
   * @returns A boolean value
   */
  wordCount(count) {
    let is_valid_count = this.body_payload.split(" ").length === count;
    return this.checkIfValid(
      is_valid_count,
      `${this.body_field} should contain exactly ${count} words`
    );
  }

  /**
   * It checks if the file size is greater than the specified size
   * @param file_size - The maximum file size in bytes.
   * @returns The object itself.
   */
  fileSize(file_size) {
    if (this.body_payload) {
      const body_size = this.body_payload.size;
      const is_valid_file_size = file_size >= body_size;

      return this.checkIfValid(
        is_valid_file_size,
        `${this.body_field} size is greater than ${file_size}`
      );
    }
    return this;
  }

  /**
   * It checks if the file type of the file uploaded is within the allowed types
   * @param [allowed_types] - An array of allowed file types.
   * @returns The instance of the class
   */
  fileType(allowed_types = []) {
    if (this.body_payload) {
      const file_type = path.extname(this.body_payload.name);
      const is_valid_file_type = allowed_types.includes(file_type);

      return this.checkIfValid(
        is_valid_file_type,
        `${
          this.body_field
        } is not within the range of valid types: ${allowed_types.join(", ")}`
      );
    }
    return this;
  }
}

module.exports = new ValidatorService();
