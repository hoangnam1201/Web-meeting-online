"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class RoomValidator {
    static createRoomValidator() {
        return [
            (0, express_validator_1.body)('name')
                .exists().withMessage('required username').bail()
                .isLength({ min: 5 }).withMessage('min length is 5'),
            (0, express_validator_1.body)('startDate')
                .exists().withMessage('required startDate').bail()
                .isNumeric().withMessage('invalid startDate'),
            (0, express_validator_1.body)('endDate')
                .exists().withMessage('required startDate').bail()
                .isNumeric().withMessage('invalid startDate')
        ];
    }
    static changeRoomValidator() {
        return [
            (0, express_validator_1.body)('name').optional().isLength({ min: 5 }).withMessage('min length is 5'),
            (0, express_validator_1.body)('startDate').optional().isNumeric().withMessage('invalid startDate'),
            (0, express_validator_1.body)('endDate').optional().isNumeric().withMessage('invalid startDate')
        ];
    }
}
exports.default = RoomValidator;
//# sourceMappingURL=room.validator.js.map