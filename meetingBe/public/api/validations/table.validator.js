"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class TableValidator {
    static tablerCreateValidator() {
        return [
            (0, express_validator_1.body)("room", "invalid roomId (room)").exists().isString(),
            (0, express_validator_1.body)("floor", "invalid floor").exists().isString(),
            (0, express_validator_1.body)("name").exists().withMessage("name is required"),
            (0, express_validator_1.body)("numberOfSeat")
                .exists()
                .withMessage("numberOfSeat is required")
                .isInt()
                .withMessage("invalid numberOfSeat"),
        ];
    }
    static tablerChangeValidator() {
        return [
            (0, express_validator_1.body)("name").optional(),
            (0, express_validator_1.body)("numberOfSeat")
                .optional()
                .isInt()
                .withMessage("invalid numberOfSeat"),
        ];
    }
}
exports.default = TableValidator;
//# sourceMappingURL=table.validator.js.map