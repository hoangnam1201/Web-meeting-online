import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routeAuth, routeHome, routeAdmin } from "./routes";
import { useDispatch } from "react-redux";
import Error from "./components/Error";
import Home from "./components/HomePage/index";
import Auth from "./components/Auth/index";
import axios from "axios";
import { useEffect } from "react";
const showLayoutHome = (routes) => {
  if (routes && routes.length > 0) {
    return routes.map((item, index) => {
      return (
        <Home
          key={index}
          exact={item.exact}
          path={item.path}
          component={item.component}
        />
      );
    });
  }
};

const showLayoutAuth = (routes) => {
  if (routes && routes.length > 0) {
    return routes.map((item, index) => {
      return (
        <Auth
          key={index}
          exact={item.exact}
          path={item.path}
          component={item.component}
        />
      );
    });
  }
};

const showLayoutAdmin = (routes) => {
  if (routes && routes.length > 0) {
    return routes.map((item, index) => {
      return (
        // <Admin
        //   key={index}
        //   exact={item.exact}
        //   path={item.path}
        //   component={item.component}
        // />
        <h2>Null</h2>
      );
    });
  }
};

function App() {
  const dispatch = useDispatch();

  // // dispatch lên redux
  // if (localStorage.getItem("user")) {
  //   dispatch({
  //     type: "LOGGED_IN",
  //     payload: JSON.parse(localStorage.getItem("user")),
  //   });
  // }
  
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {showLayoutAdmin(routeAdmin)}

          {showLayoutHome(routeHome)}

          {showLayoutAuth(routeAuth)}

          {/* Không tìm ra trang nào */}
          <Route path="" component={Error} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
