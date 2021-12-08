import instance from "./instanceAxios"

export const loginAPI = (userForm) => {
    return instance.post('/auth/login', userForm);
}

export const getInfoAPI = () => {
    return instance.get('/user/get-detail');
}

export const searchUserAPI = (str) => {
    return instance.get('/user/search', { params: { searchValue: str } });
}