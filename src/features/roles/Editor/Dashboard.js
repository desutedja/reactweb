import React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import Task from "../../dashboard/Task";
import Transaction from "../../dashboard/Transaction";
import Billing from "../../dashboard/Building";
import Advertisement from "../../dashboard/Advertisement";
import Cctv from "../../dashboard/Cctv";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Redirect exact from={path} to={`${path}/task`} />
      <Route path={`${path}/task`}>
        <Task />
      </Route>
      <Route path={`${path}/advertisement`}>
        <Advertisement />
      </Route>
      <Route path={`${path}/building`}>
        <Billing />
      </Route>
      <Route path={`${path}/transaction`}>
        <Transaction />
      </Route>
      <Route path={`${path}/CCTV`}>
        <Cctv />
      </Route>
    </Switch>
  );
}

export default Component;
