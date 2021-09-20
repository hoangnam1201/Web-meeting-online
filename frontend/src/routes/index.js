import HomePage from "../components/HomePage/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
export const routeHome = [
  {
    exact: true,
    path: ["/", "/home"],
    component: HomePage,
  },
];
export const routeAdmin = [];
export const routeAuth = [
  {
    exact: false,
    path: "/login",
    component: Login,
  },
  {
    exact: false,
    path: "/register",
    component: Register,
  },
  // {
  //   exact: false,
  //   path: "/forgot",
  //   component: Forget,
  // },
];
