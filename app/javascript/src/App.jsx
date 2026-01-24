import React from "react";

import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Login, Signup } from "components/Authentication";
import PrivateRoute from "components/Common/PrivateRoute";
import Dashboard from "components/Dashboard";
import MyPreferences from "components/MyPreferences";
import {
  CreateTask,
  DownloadReport,
  EditTask,
  ShowTask,
} from "components/Tasks";
import { getFromLocalStorage } from "utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact component={ShowTask} path="/tasks/:slug/show" />
        <Route exact component={EditTask} path="/tasks/:slug/edit" />
        <Route exact component={CreateTask} path="/tasks/create" />
        <Route exact component={DownloadReport} path="/tasks/report" />
        <Route exact component={Signup} path="/signup" />
        <Route exact component={Login} path="/login" />
        <Route exact component={MyPreferences} path="/my/preferences" />
        <PrivateRoute
          component={Dashboard}
          condition={isLoggedIn}
          path="/"
          redirectRoute="/login"
        />
      </Switch>
    </Router>
  );
};

export default App;
