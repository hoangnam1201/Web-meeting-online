import { body } from "express-validator";

export const tableCreateValidator = () => {
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
};

export const tableUpdateValidator = () => {
  return [
    body("ids").exists().isArray(),
    body("name").optional(),
    body("numberOfSeat").optional().isInt().withMessage("invalid numberOfSeat"),
    body("floor", "invalid floor").optional().isString(),
  ];
};
