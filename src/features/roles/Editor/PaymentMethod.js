import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/PaymentMethod";
import Add from "../../form/PaymentMethod";
import Edit from "../../form/PaymentMethodEdit";
import Details from "../../details/PaymentMethod";

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
