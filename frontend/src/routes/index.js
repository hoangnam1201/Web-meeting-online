import HomePage from "../components/HomePage/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Profile from "../components/Profile/index";
import MyEvent from "../components/MyEvent";
import UpdateEvent from "../components/updateEvent";
import RoomCall from "../components/roomCall";
import GroupManagement from "../components/groupManagement";
import TableManagement from "../components/tableManagement";
import QuizManagement from "../components/quizManagement";
import ManageUser from "../components/Admin/manageUser";
import ManageRoom from "../components/Admin/manageRoom";
import AddMembers from "../components/updateEvent/members";
import Quiz from "../components/Quiz";
import QuizScores from "../components/Quiz/quizScores";
import NotFound from "../components/notFound";

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
  {
    exact: true,
    path: "/user/management-groups/:roomId",
    component: GroupManagement,
  },
  {
    exact: true,
    path: "/user/management-tables/:id",
    component: TableManagement,
  },
  {
    exact: true,
    path: "/user/management-quiz/:id",
    component: QuizManagement,
  },
  {
    exact: true,
    path: "/user/quiz-scores/:id",
    component: QuizScores,
  },
  { exact: true, path: "/user/management-member/:id", component: AddMembers },
  {
    path: '*',
    component: NotFound
  }
];

export const roomRoute = [
  {
    exact: true,
    path: "/room/:id",
    component: RoomCall,
  },
  {
    path: '*',
    component: NotFound
  }
];

export const quizRoute = [
  {
    exact: true,
    path: "/quiz/:id",
    component: Quiz,
  },
  {
    path: '*',
    component: NotFound
  }
]

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
  {
    path: '*',
    component: NotFound
  }
];

export const homeRoute = [
  {
    exact: true,
    path: ["/", "/home"],
    component: HomePage,
  },
  {
    path: '*',
    component: NotFound
  }
];

export const adminRoute = [
  {
    exact: true,
    path: ["/admin", "/admin/user"],
    component: ManageUser,
  },
  {
    exact: true,
    path: "/admin/room",
    component: ManageRoom,
  },
  {
    path: '*',
    component: NotFound
  }
];
