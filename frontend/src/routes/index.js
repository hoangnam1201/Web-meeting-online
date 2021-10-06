import HomePage from "../components/HomePage/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Profile from "../components/Profile/index";
import MyEvent from "../components/MyEvent";
import RoomDetail from "../components/RoomDetail";
import CheckMedia from "../components/CheckMedia";
export const routeHome = [
  {
    exact: true,
    path: ["/", "/home"],
    component: HomePage,
  },
  {
    exact: false,
    path: "/profile",
    component: Profile,
  },
  {
    exact: false,
    path: "/my-event",
    component: MyEvent,
  },
  {
    exact: false,
    path: "/room/id/:id",
    component: RoomDetail,
  },
  {
    exact: false,
    path: "/check-media",
    component: CheckMedia,
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
