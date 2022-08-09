const authService = require("./authService");

class Sanitization {
  body_data = "";

  body(body_data) {
    this.body_data = body_data;
    return this;
  }

  // FORMAT => "LEFT", "RIGHT", "NULL"
  toTrim(format = null) {
    if (format === "left") this.body_data = this.body_data?.trimStart();
    else if (format === "right") this.body_data = this.body_data?.trimEnd();
    else this.body_data = this.body_data?.trim();
    return this;
  }

  #getCapitalizeText() {
    let text_list = this.body_data?.split(" ");
    let first_letters = [];
    let modified_list = [];

    text_list?.map((text) => first_letters?.push(text?.charAt(0)));
    text_list?.map((text, index) =>
      modified_list?.push(
        `${first_letters[index]?.toUpperCase()}${text?.substring(1)}`
      )
    );

    return modified_list?.join(" ");
  }

  // CASE TYPE => "UPPER", "LOWER", "CAPITALIZE"
  toCase(case_type = null) {
    if (case_type === "upper") this.body_data = this.body_data?.toUpperCase();
    else if (case_type === "lower")
      this.body_data = this.body_data?.toLowerCase();
    else this.body_data = this.#getCapitalizeText();
    return this;
  }

  toHash() {
    this.body_data = authService.hashPassword(this.body_data);
    return this;
  }
}

module.exports = new Sanitization();
