import instance from "./instanceAxios";
import { Cookies } from "react-cookie";

export const loginAPI = (userForm) => {
  return instance.post("/auth/login", userForm);
};

export const googleLoginAPI = (token) => {
  return instance.post("/auth/google-login", { token: token });
};

export const logoutAPI = () => {
  const cookies = new Cookies();
  const auth = cookies.get("u_auth");
  return instance.post("/auth/token/revoke", {
    refreshToken: auth?.refreshToken,
  });
};

export const renewToken = () => {
  const cookies = new Cookies();
  const auth = cookies.get("u_auth");
  return instance.post("/auth/token", { refreshToken: auth.refreshToken });
};

export const getInfoAPI = () => {
  return instance.get("/user/get-detail");
};

export const getInfoByIdAPI = (id) => {
  return instance.get("/user/get-by-id/" + id);
}

export const searchUserAPI = (str) => {
  return instance.get("/user/search", { params: { searchValue: str } });
};

export const changeUserInfoAPI = (data) => {
  return instance.put("/user/change-infor", data);
};

export const changePasswordAPI = (data) => {
  return instance.put("/user/change-password", data);
};

export const registerAPI = (data) => {
  return instance.post("/user/register", data);
};

export const getAllUserAPI = (pageSize, pageIndex, searchStr, role) => {
  return instance.get("/user", {
    params: {
      take: pageSize,
      page: pageIndex,
      searchStr: searchStr,
      role: role,
    },
  });
};

export const updateUserAPI = (data) => {
  return instance.put("/user/update-permission", data);
};
