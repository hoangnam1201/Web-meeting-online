import HomePage from "../components/HomePage/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Profile from "../components/Profile/index";
import MyEvent from "../components/MyEvent";
import RoomDetail from "../components/RoomDetail";
import CheckMedia from "../components/CheckMedia";
import Presentation from "../components/Present";
import UpdateEvent from "../components/updateEvent";
import RoomCall from "../components/roomCall";

export const userRoute = [
  {
    exact: false,
    path: "/user/profile",
    component: Profile,
  },
  {
    exact: true,
    path: "/user/my-event",
    component: MyEvent,
  },
  {
    exact: true,
    path: "/user/update-event/:id",
    component: UpdateEvent,
  },
];

export const roomRoute = [
  {
    exact: true,
    path: "/room/id/:id",
    component: RoomCall,
  },
  {
    exact: true,
    path: "/room/check-media",
    component: CheckMedia,
  },
  { exact: true, path: "/room/present", component: Presentation },
];

export const authRoute = [
  {
    exact: true,
    path: "/auth/login",
    component: Login,
  },
  {
    exact: true,
    path: "/auth/register",
    component: Register,
  },
];

export const homeRoute = [
  {
    exact: true,
    path: ["/", "/home"],
    component: HomePage,
  },
];
