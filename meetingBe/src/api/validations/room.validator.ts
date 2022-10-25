import { body } from "express-validator";

export const createRoomValidator = () => {
  return [
    body("name")
      .exists()
      .withMessage("required username")
      .bail()
      .isLength({ min: 5 })
      .withMessage("min length is 5"),
    body("startDate")
      .exists()
      .withMessage("required startDate")
      .bail()
      .isNumeric()
      .withMessage("invalid startDate"),
    body("endDate")
      .exists()
      .withMessage("required startDate")
      .bail()
      .isNumeric()
      .withMessage("invalid startDate"),
  ];
};

export const changeRoomValidator = () => {
  return [
    body("name").optional().isLength({ min: 5 }).withMessage("min length is 5"),
    body("startDate").optional().isNumeric().withMessage("invalid startDate"),
    body("endDate").optional().isNumeric().withMessage("invalid startDate"),
  ];
};
