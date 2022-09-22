import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../PromoVA/List/PromoVA";
import Add from "../../PromoVA/Form/PromoVa";
import Edit from "../../PromoVA/Form/PromoVAEdit";
import Details from "../../details/PromoVA";

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
