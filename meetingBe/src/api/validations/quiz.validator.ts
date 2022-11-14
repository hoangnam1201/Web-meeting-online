import { body } from "express-validator";

export class QuizValidator {
  static checkCreate() {
    return [
      body("room").exists().withMessage("required room").isMongoId(),
      body("name").exists().withMessage("required name").isString(),
      body("description")
        .exists()
        .withMessage("required description")
        .isString(),
      body("startDate").exists().withMessage("required startDate").isNumeric(),
      body("endDate").exists().withMessage("required endDate").isNumeric(),
      body("duration").exists().withMessage("required duration").isNumeric(),
      body("countSubmission")
        .exists()
        .withMessage("required countSubmission")
        .isNumeric(),
    ];
  }

  static checkUpdate() {
    return [
      body("name").optional().isString(),
      body("description").optional().isString(),
      body("startDate").optional().isNumeric(),
      body("endDate").optional().isNumeric(),
      body("duration").optional().isNumeric(),
      body("countSubmission").optional().isNumeric(),
    ];
  }
}
