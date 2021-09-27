import { Router } from "express";
import { body } from "express-validator";
import RoomController from "../controllers/room.controller";
import AuthMiddlesware from '../middlewares/auth.middleware';
import RoomValidator from "../validations/room.validator";

const roomRoute = Router();
const roomController = new RoomController()

roomRoute.post('',
    [AuthMiddlesware.verifyToken, ...RoomValidator.createRoomValidator()],
    roomController.createRoom);
roomRoute.delete('/:roomId',
    [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership],
    roomController.deleteRoom);
roomRoute.put('/:roomId',
    [AuthMiddlesware.verifyToken, ...RoomValidator.changeRoomValidator()],
    roomController.changeRoom);
roomRoute.get('/owned-room',
    AuthMiddlesware.verifyToken,
    roomController.getOwnedRoom);
roomRoute.get('/invited-room',
    AuthMiddlesware.verifyToken,
    roomController.getInvitedRoom);
roomRoute.get('/:roomId',
    AuthMiddlesware.verifyToken,
    roomController.getRoomById);
roomRoute.post('/members/add-member/:roomId',
    [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership, body('userId', 'invalid userId').exists().isString()],
    roomController.addMember);
roomRoute.delete('/members/remove-member/:roomId',
    [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership, body('userId', 'invalid userId').exists().isString()],
    roomController.removeMember);
roomRoute.post('/members/add-members/:roomId',
    [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership, body('userIds', 'invalid userId').exists().isArray()],
    roomController.addMembers);
roomRoute.delete('/members/remove-members/:roomId',
    [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership, body('userIds', 'invalid userId').exists().isArray()],
    roomController.removeMembers);

export default roomRoute;