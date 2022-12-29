import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../feature/UserRequest/List/UserRequest";
import Add from "../../feature/UserRequest/Form/UserRequest";
import Edit from "../../feature/UserRequest/Form/UserRequestEdit";
import Details from "../../feature/UserRequest/Detail";

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
