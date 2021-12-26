import { Router } from "express";
import TablerController from "../controllers/table.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import TableValidator from "../validations/table.validator";

const tableRoute = Router();
const tableController = new TablerController();

tableRoute.post('',
    [AuthMiddlesware.verifyToken, ...TableValidator.tablerCreateValidator()],
    tableController.createTable);

tableRoute.delete('/:tableId',
    AuthMiddlesware.verifyToken,
    tableController.deleteTable);

tableRoute.put('/save-members/:roomId',
    AuthMiddlesware.verifyToken,
    tableController.saveMember);

tableRoute.put('/add-user/:tableId',
    AuthMiddlesware.verifyToken,
    tableController.addUser);

tableRoute.put('/reomve-user/:tableId',
    AuthMiddlesware.verifyToken,
    tableController.removeUser);

tableRoute.get('/:tableId',
    AuthMiddlesware.verifyToken,
    tableController.getTable);

tableRoute.get('/get-by-room/:roomId',
    AuthMiddlesware.verifyToken,
    tableController.getTablesInRoom);

export default tableRoute;