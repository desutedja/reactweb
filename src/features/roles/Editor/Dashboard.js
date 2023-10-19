import React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import Advertisement from "../../dashboard/Advertisement";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Redirect exact from={path} to={`${path}/advertisement`} />
      <Route path={`${path}/advertisement`}>
        <Advertisement />
      </Route>
    </Switch>
  );
}

export default Component;
