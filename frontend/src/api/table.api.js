import instance from "./instanceAxios";

export const getTablesAPI = (roomId) => {
  return instance.get("/table/get-by-room/" + roomId);
};

export const getTablesByRoomAndFloorAPI = (roomId, floor) => {
  return instance.get("/table/in-room-and-floor/" + roomId, {
    params: { floor },
  });
};

export const createTableAPI = (data) => {
  return instance.post("/table", data);
};

export const deleteTableAPI = (id) => {
  return instance.delete("/table/" + id);
};

export const updateTableAPI = (ids, data) => {
  return instance.put("/table/", { ids, ...data });
};

export const saveTableMembersAPI = (roomId) => {
  return instance.put("/table/save-members/" + roomId);
};

export const getMemberTablesAPI = (roomId, pageIndex, pageSize) => {
  return instance.get("/table/members/" + roomId, {
    params: { limit: pageSize, page: pageIndex },
  });
};

export const searchMemberAPI = (roomId) => {
  return instance.get("/table/members/search/" + roomId);
};

export const addMemberTableAPI = (tableId, userId) => {
  return instance.put("/table/add-user/" + tableId, { userId });
};

export const removeMemberTableAPI = (tableId, userId) => {
  return instance.put("/table/remove-user/" + tableId, { userId });
};

export const downloadMemberTableCSVAPI = (roomId) => {
  return instance.get("/table/members/download-csv/" + roomId);
}

export const addMemberTableByFileAPI = (roomId, data) => {
  return instance.post('/table/members/add-by-file/' + roomId, data)
}