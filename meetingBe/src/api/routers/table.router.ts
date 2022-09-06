import { Router } from "express";
import { query } from "express-validator";
import TablerController from "../controllers/table.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import TableValidator from "../validations/table.validator";

const tableRoute = Router();
const tableController = TablerController();

tableRoute.post(
  "",
  [AuthMiddlesware.verifyToken, ...TableValidator.tablerCreateValidator()],
  tableController.createTable
);

tableRoute.delete(
  "/:tableId",
  AuthMiddlesware.verifyToken,
  tableController.deleteTable
);

tableRoute.put(
  "/save-members/:roomId",
  AuthMiddlesware.verifyToken,
  tableController.saveMember
);

tableRoute.put(
  "/add-user/:tableId",
  AuthMiddlesware.verifyToken,
  tableController.addUser
);

tableRoute.put(
  "/remove-user/:tableId",
  AuthMiddlesware.verifyToken,
  tableController.removeUser
);

tableRoute.get(
  "/:tableId",
  AuthMiddlesware.verifyToken,
  tableController.getTable
);

tableRoute.get(
  "/get-by-room/:roomId",
  AuthMiddlesware.verifyToken,
  tableController.getTablesInRoom
);

tableRoute.get("/members/search/:roomId", tableController.searchMember);

tableRoute.get(
  "/members/:roomId",
  AuthMiddlesware.verifyToken,
  tableController.getMemberTables
);

tableRoute.get(
  "/in-room-and-floor/:roomId",
  [
    AuthMiddlesware.verifyToken,
    query("floor", "floor is required").exists().isString(),
  ],
  tableController.getTablesInRoomAndFloor
);

export default tableRoute;
