import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/UserRequest";
import Add from "../../form/UserRequest";
import Edit from "../../form/UserRequestEdit";
import Details from "../../details/UserRequest";

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
        <Edit />
      </Route>
      <Route path={`${path}/:id`}>
        <Details />
      </Route>
    </Switch>
  );
}

export default Component;
