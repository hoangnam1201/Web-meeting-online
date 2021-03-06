import instance from "./instanceAxios";

export const getTablesAPI = (roomId) => {
    return instance.get('/table/get-by-room/' + roomId);
}

export const createTableAPI = (data) => {
    return instance.post('/table', data);
}

export const deleteTableAPI = (id) => {
    return instance.delete('/table/' + id);
}

export const updateTableAPI = (id, data) => {
    return instance.put('/table/' + id, data);
}

export const saveTableMembersAPI = (roomId) => {
    return instance.put('/table/save-members/' + roomId);
}

export const getMemberTablesAPI = (roomId, pageIndex, pageSize) => {
    return instance.get('/table/members/' + roomId,
        { params: { limit: pageSize, page: pageIndex } });
}

export const searchMemberAPI = (roomId) => {
    return instance.get('/table/members/search/' + roomId);
}

export const addMemberTableAPI = (tableId, userId) => {
    return instance.put('/table/add-user/' + tableId, { userId })
}

export const removeMemberTableAPI = (tableId, userId) => {
    return instance.put('/table/remove-user/' + tableId, { userId })
}