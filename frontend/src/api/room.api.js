import axios from "axios";
import instance, { baseURL } from "./instanceAxios";

export const getInvitedRoomAPI = () => {
  return instance.get("/room/invited-room");
};

export const getOwnerRoomAPI = () => {
  return instance.get("/room/owned-room");
};

export const deleteRoomAPI = (roomId) => {
  return instance.delete(`room/${roomId}`);
};

export const createRoomApi = (data) => {
  return instance.post("/room", data);
};

export const updateRoomApi = (id, data) => {
  return instance.put("/room/" + id, data);
};

export const updateStateRoomApi = (id, state) => {
  return instance.put("/room/state/" + id, { state });
};

export const getRoomAPI = (id) => {
  return instance.get("/room/" + id);
};

export const increaseFloorAPI = (id) => {
  return instance.post("/room/floors/" + id);
};

export const deleteFloorAPI = (id, floor) => {
  return instance.delete("/room/floors/" + id, { params: { floor: floor } });
};

export const addMembersAPI = (roomId, userIds) => {
  return instance.post("/room/members/add-members/" + roomId, { userIds });
};

export const addMembersByFileAPI = (roomId, data) => {
  return instance.post("/room/members/add-members-by-file/" + roomId, data);
};

export const dowloadMemberCSVFileAPI = (roomId) => {
  return instance.get("/room/members/download-csv/" + roomId);
};

export const removeMemberAPI = (roomId, userId) => {
  return instance.delete("/room/members/remove-member/" + roomId, {
    params: { userId },
  });
};

export const getAllRoomAPI = (pageSize, pageIndex, ownerId) => {
  return instance.get("/room", {
    params: { take: pageSize, page: pageIndex, ownerId: ownerId },
  });
};

export const banRoomAPI = (id) => {
  return instance.put("/room/ban-room/" + id);
};

export const unbanRoomAPI = (id) => {
  return instance.put("/room/unban-room/" + id);
};

export const downloadJoinersAPI = (id) => {
  return fetch(baseURL + "room/joiners/download/" + id, { method: 'GET' });
};
