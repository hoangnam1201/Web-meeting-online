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