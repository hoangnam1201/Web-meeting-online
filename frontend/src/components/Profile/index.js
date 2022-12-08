import React from "react";
import { Route, Switch, NavLink, Redirect } from "react-router-dom";
import ChangePassword from "./changepassword";
import Profiles from "./profile";

const Profile = () => {
  return (
    <div className="md:flex min-h-screen">
      <nav className="shadow-lg ">
        <div className="p-3 flex justify-start gap-3 items-center md:block">
          <NavLink
            className="py-2 rounded-md px-5 md:block text-gray-500"
            activeClassName="bg-blue-100"
            to="/user/profile/change-profile"
          >
            Profile
          </NavLink>

          <NavLink
            className="py-2 rounded-md px-5 md:block text-gray-500"
            activeClassName="bg-blue-100"
            to="/user/profile/change-password"
          >
            Change Password
          </NavLink>
        </div>
      </nav>
      <div className="flex-grow">
        <Switch>
          <Route path="/user/profile/change-profile" component={Profiles} />
          <Route
            path="/user/profile/change-password"
            component={ChangePassword}
          />
          <Route
            path="/"
            render={() => <Redirect to="/user/profile/change-profile" />}
          />
        </Switch>
      </div>
    </div>
  );
};
export default Profile;
