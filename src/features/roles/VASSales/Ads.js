import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import Details from "../../details/Ads";
import Add from "../../form/Ads";
import List from "../../list/Ads";

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
      <Route path={`${path}/edit`}>
        <Add />
      </Route>
      <Route path={`${path}/:id`}>
        <Details />
      </Route>
    </Switch>
  );
}

export default Component;
