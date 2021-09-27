import { body } from "express-validator";

export default class RoomValidator {
    static createRoomValidator() {
        return [
            body('name')
                .exists().withMessage('required username').bail()
                .isLength({ min: 6 }).withMessage('min length is 5'),
            body('roomType')
                .exists().withMessage('required roomType').bail()
                .custom((value: number) => (value >= 0 && value <= 3)).withMessage('roomType has a value from 0 to 3'),
            body('startDate')
                .exists().withMessage('required startDate').bail()
                .isNumeric().withMessage('invalid startDate'),
            body('endDate')
                .exists().withMessage('required startDate').bail()
                .isNumeric().withMessage('invalid startDate')
        ]
    }

    static changeRoomValidator() {
        return [
            body('name').optional().isLength({ min: 6 }).withMessage('min length is 5'),
            body('roomType').optional().custom((value: number) => (value >= 0 && value <= 3)).withMessage('roomType has a value from 0 to 3'),
            body('startDate').optional().isNumeric().withMessage('invalid startDate'),
            body('endDate').optional().isNumeric().withMessage('invalid startDate')
        ]
    }
}
