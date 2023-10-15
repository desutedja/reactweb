import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/User";
import Add from "../../form/Users";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <List />
      </Route>
      <Route path={`${path}/add`}>
        <Add />
      </Route>
    </Switch>
  );
}

export default Component;
