import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { roomRoute, userRoute, homeRoute, authRoute } from "./routes";
import UserAuth from "./routes/helper/userAuth";
import Error from "./components/Error";
import DefautLayout from './layouts/defautLayout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/auth">
            <Switch>
              {authRoute.map((route, index) => (
                <Route path={route.path} exact={route.exact} component={route.component} key={index} />
              ))}
              <Route path="*">
                <Error type={0} />
              </Route>
            </Switch>
          </Route>
          <UserAuth path="/user">
            <DefautLayout logged={true}>
              <Switch>
                {userRoute.map((route, index) => (
                  <Route path={route.path} exact={route.exact} component={route.component} key={index} />
                ))}
                <Route path="*" exact component={Error} />
              </Switch>
            </DefautLayout>
          </UserAuth>
          <UserAuth path="/room">
            <DefautLayout logged={true}>
              <Switch>
                {roomRoute.map((route, index) => (
                  <Route path={route.path} exact={route.exact} component={route.component} key={index} />
                ))}
                <Route path="*" exact component={Error} />
              </Switch>
            </DefautLayout>
          </UserAuth>
          <DefautLayout logged={false}>
            <Switch>
              {homeRoute.map((route, index) => (
                <Route path={route.path} exact={route.exact} component={route.component} Key={index} />
              ))}
              <Route path="*" component={Error} />
            </Switch>
          </DefautLayout>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
