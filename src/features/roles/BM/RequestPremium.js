import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import List from "../../list/RequestPremium";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
        <Route exact path={path}>
            <List />
        </Route>
    </Switch>
  );
}

export default Component;
