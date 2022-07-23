import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Share from "../Share";
import HomePage from "./HomePage";
import Dashboard from "./DashBoard";
import YourAccount from "./YourAccount";
import SharedFiles from "./SharedFiles";
import ViewSharedFiles from "./ViewSharedFiles";

function Routers() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard}></Route>
          <Route exact path="/share" component={Share}></Route>
          <Route exact path="/account" component={YourAccount}></Route>
          <Route exact path="/sharedfiles" component={ViewSharedFiles}></Route>
        </Switch>
      </Router>
      <ul id="Transactions"></ul>
    </div>
  );
}

export default Routers;
