import instance from "./instanceAxios";

export const createRoomApi = (data) => {
    return instance.post('/room', data);
}

export const updateRoomApi = (id, data) => {
    return instance.put('/room/' + id, data);
}

export const getRoomAPI = (id) => {
    return instance.get('/room/' + id);
}

export const addMembersAPI = (roomId, userIds) => {
    return instance.post('/room/members/add-members/' + roomId, { userIds })
}

export const removeMemberAPI = (roomId, userId) => {
    console.log(userId)
    return instance.delete('/room/members/remove-member/' + roomId, { params: { userId } })
}