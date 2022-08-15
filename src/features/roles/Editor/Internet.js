import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/Internet";
import Add from "../../form/Internet";
import AddPackage from "../../form/InternetPackage";
import EditPackage from "../../form/InternetPackageEdit";
import Edit from "../../form/InternetEdit";
import Details from "../../details/Internet";
import DetailPackage from "../../details/InternetPackage"

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
      <Route path={`${path}/:id/add`}>
        <AddPackage />
      </Route>
      <Route path={`${path}/:id/package/edit`}>
        <EditPackage />
      </Route>
      <Route path={`${path}/:id/package/:id`}>
        <DetailPackage />
      </Route>
      <Route path={`${path}/:id`}>
        <Details />
      </Route>
    </Switch>
  );
}

export default Component;
