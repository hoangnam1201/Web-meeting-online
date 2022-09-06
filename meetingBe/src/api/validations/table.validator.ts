import { body } from "express-validator";

export default class TableValidator {
  static tablerCreateValidator() {
    return [
      body("room", "invalid roomId (room)").exists().isString(),
      body("floor", "invalid floor").exists().isString(),
      body("name").exists().withMessage("name is required"),
      body("numberOfSeat")
        .exists()
        .withMessage("numberOfSeat is required")
        .isInt()
        .withMessage("invalid numberOfSeat"),
    ];
  }
  static tablerChangeValidator() {
    return [
      body("name").optional(),
      body("numberOfSeat")
        .optional()
        .isInt()
        .withMessage("invalid numberOfSeat"),
    ];
  }
}
