import { body } from 'express-validator';

export default class TableValidator {
    static tablerCreateValidator() {
        return [
            body('room', 'invalid roomId (room)').exists().isString(),
            body('name')
                .exists().withMessage('name is required')
                .isLength({ min: 5 }).withMessage('min length name is 5'),
            body('numberOfSeat')
                .exists().withMessage('numberOfSeat is required')
                .isInt().withMessage('invalid numberOfSeat')
        ]
    }
    static tablerChangeValidator() {
        return [
            body('name')
                .optional()
                .isLength({ min: 5 }).withMessage('min length name is 5'),
            body('numberOfSeat')
                .optional()
                .isInt().withMessage('invalid numberOfSeat')
        ]
    }
}