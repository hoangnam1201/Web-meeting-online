import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routeAuth, routeHome, routeAdmin } from "./routes";
import Error from "./components/Error";
import Home from "./components/HomePage/index";
import Auth from "./components/Auth/index";
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

function App() {
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
