import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

// V1
// import List from "../../list/Vouchers";
// import Add from "../../form/Vouchers";
// import Details from "../../details/Vouchers";

// V2
import List from "../../feature/Vouchers/List/Vouchers";
import Add from "../../feature/Vouchers/Form/Vouchers";
import Details from "../../feature/Vouchers/Detail/index";


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
