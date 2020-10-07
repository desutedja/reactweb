import React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import Task from "../../dashboard/Task";
import Billing from "../../dashboard/Building";
import Advertisement from "../../dashboard/Advertisement";

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
    </Switch>
  );
}

export default Component;
