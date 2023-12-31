import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/Building";
import Add from "../../form/Building";
import AddManagement from "../../form/BuildingManagement";
import Details from "../../details/Building";

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
      <Route path={`${path}/:id/add`}>
        <AddManagement />
      </Route>
      <Route path={`${path}/:id/edit`}>
        <AddManagement />
      </Route>
      <Route path={`${path}/:id`}>
        <Details />
      </Route>
    </Switch>
  );
}

export default Component;
