import * as React from "react";
import { styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  actionRemoveUserInfo,
  getUserInfo,
} from "../store/actions/userInfoAction";
import Avatar from "react-avatar";
import { CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { logoutAPI } from "../api/user.api";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [, , removeCookies] = useCookies(["u_auth"]);
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      if (!currentUser?.user) {
        dispatch(getUserInfo());
      }
    }
  }, []);

  const handleLogout = () => {
    logoutAPI().then(() => {
      dispatch(actionRemoveUserInfo());
      removeCookies("u_auth", { path: "/" });
      history.push("/auth/login");
      Swal.fire({
        icon: "success",
        title: "Logout successfull !!",
        text: "Thank you for using UTE Meeting",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box onClick={() => setShowAvatarMenu(false)} sx={{ display: "flex" }}>
      <Helmet>
        <title>Admin dashboard</title>
        <meta charSet="utf-8" name="description" content="Admin" />
      </Helmet>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <div className="flex items-center justify-between w-full px-10">
            <Typography variant="h6" noWrap component="div">
              Admin Dasboard
            </Typography>
            <div
              className="relative p-2"
              onClick={(e) => {
                setShowAvatarMenu(!showAvatarMenu);
                e.stopPropagation();
              }}
            >
              {currentUser?.loading && (
                <div>
                  <CircularProgress size="3rem" />
                </div>
              )}
              {!currentUser?.loading &&
                (currentUser?.user?.picture ? (
                  <img
                    src={currentUser?.user?.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="cursor-pointer rounded-full w-12"
                  ></img>
                ) : (
                  <Avatar
                    name={currentUser?.user?.name}
                    size="50"
                    round={true}
                    className="cursor-pointer"
                  ></Avatar>
                ))}

              {showAvatarMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-30 mt-2 bg-blue-50 rounded-lg shadow-lg w-40 left-1/2 transform -translate-x-1/2"
                >
                  <ul className="p-1">
                    <li className="font-bold text-gray-500 border-b-2 p-3 overflow-hidden text-ellipsis">
                      {currentUser?.user?.name}
                    </li>

                    <li className="py-3 font-medium hover:bg-blue-100 text-gray-500">
                      <Link underline="none" to="/user/my-event">
                        My event
                      </Link>
                    </li>

                    <li className="py-3 font-medium hover:bg-blue-100 text-gray-500">
                      <Link underline="none" to="/user/profile">
                        Profile
                      </Link>
                    </li>
                    <li className="py-3 font-medium hover:bg-blue-100 text-gray-500">
                      <button onClick={handleLogout}>Log out</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["User", "Room"].map((text, index) => (
            <Link
              key={index}
              to={`${text === "User" ? "/admin/user" : "/admin/room"}`}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <EventIcon /> : <PersonIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          <Link to="/user/my-event">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText primary="Back" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
