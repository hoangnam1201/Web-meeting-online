import instance from "./instanceAxios";

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

export const addMembersByFile = (roomId, data) => {
  return instance.post("/room/members/add-members-by-file/" + roomId, data);
};

export const removeMemberAPI = (roomId, userId) => {
  return instance.delete("/room/members/remove-member/" + roomId, {
    params: { userId },
  });
};
