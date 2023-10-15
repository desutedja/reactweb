import React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import List from "../../list/Membership";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Redirect exact from={path} to={`${path}/log`} />
      <Route exact path={`${path}/log`}>
          <List />
      </Route>
      {/* <Route path={`${path}/add`}>
        <Add />
      </Route>
      <Route path={`${path}/membership/edit`}>
        <Edit />
      </Route>
      <Route path={`${path}/membership/:id`}>
        <Details />
      </Route>
      <Route path={`${path}/membership/:id`}>
        <FacilityDetails />
      </Route> */}
    </Switch>
  );
}

export default Component;
