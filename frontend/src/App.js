import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { roomRoute, userRoute, homeRoute, authRoute } from "./routes";
import UserAuth from "./routes/helper/userAuth";
import UnAuth from "./routes/helper/unAuth";
import Error from "./components/Error";
import DefautLayout from "./layouts/defautLayout";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const notification = useSelector((state) => state.globalNofification);

  useEffect(() => {
    if (!notification) return;
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  }, [notification]);
  console.log(process.env.REACT_APP_CLIENT_ID);
  return (
    <div className="App">
      <div
        className="fixed top-24 transform -translate-x-full w-56"
        style={{ zIndex: 100, left: "90%" }}
        hidden={!showNotification}
      >
        {notification && (
          <Alert severity={notification.icon}>{notification.msg}</Alert>
        )}
      </div>

      <BrowserRouter>
        <Switch>
          <Route path="/auth">
            <UnAuth>
              <Switch>
                {authRoute.map((route, index) => (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    key={index}
                  />
                ))}
                <Route path="*">
                  <Error type={0} />
                </Route>
              </Switch>
            </UnAuth>
          </Route>
          <UserAuth path="/user">
            <DefautLayout logged={true}>
              <Switch>
                {userRoute.map((route, index) => (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    key={index}
                  />
                ))}
                <Route path="*" exact component={Error} />
              </Switch>
            </DefautLayout>
          </UserAuth>
          <UserAuth path="/room">
            <DefautLayout logged={true}>
              <Switch>
                {roomRoute.map((route, index) => (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    key={index}
                  />
                ))}
                <Route path="*" exact component={Error} />
              </Switch>
            </DefautLayout>
          </UserAuth>
          <UnAuth>
            <DefautLayout logged={false}>
              <Switch>
                {homeRoute.map((route, index) => (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    Key={index}
                  />
                ))}
                <Route path="*" component={Error} />
              </Switch>
            </DefautLayout>
          </UnAuth>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
