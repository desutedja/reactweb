import React, { useState } from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import Add from "../../form/Billing";
import Detailsv2 from "../../details/Billingv2";
import DetailsItem from "../../details/BillingItem";
import Settlement from "../../settlement/Billing";
import BillingRecord from "../../details/BillingRecord";

import List from "../../list/Billing";

function Component() {
  let { path } = useRouteMatch();
  const page = "billing";
  const activeModuleAccess = useSelector((state) => state.auth.access);
  const [read, setRead] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [del, setDel] = useState(false);
  if (activeModuleAccess.unmapped.length > 0) {
    let access = activeModuleAccess.unmapped.filter((item) => {
      return item.value == page;
    });
    console.log(access);
    if (access.length > 0) {
      access = access[0].privilege;
    }
    access.map((item) => {
      switch (item) {
        case "read":
          if (!read) {
            setRead(true);
          }
          break;
        case "create":
          if (!create) {
            setCreate(true);
          }
          break;
        case "update":
          if (!update) {
            setUpdate(true);
          }
          break;
        case "delete":
          if (!del) {
            setDel(true);
          }
          break;
      }
    });
  }

  return (
    <Switch>
      <Redirect exact from={path} to={`${path}/unit`} />
      {read && (
        <Route
          exact
          path={`${path}/unit`}
          canAdd={create}
          canUpdate={update}
          canDelete={del}
        >
          <List />
        </Route>
      )}
      {update && (
        <Route
          path={`${path}/edit`}
          canAdd={create}
          canUpdate={update}
          canDelete={del}
        >
          <Add />
        </Route>
      )}
      <Redirect
        exact
        from={`${path}/unit/:unitid/record`}
        to={`${path}/unit/:unitid`}
        canAdd={create}
      />
      <Route path={`${path}/unit/:unitid/record/:trx_code`}>
        <BillingRecord />
      </Route>
      {update && (
        <Route path={`${path}/unit/:unitid/edit`}>
          <Add />
        </Route>
      )}
      {create && (
        <Route path={`${path}/unit/:unitid/add`}>
          <Add />
        </Route>
      )}
      <Route path={`${path}/unit/:unitid/:id`}>
        <DetailsItem canUpdate={update} canAdd={create} canDelete={del} />
      </Route>
      <Route path={`${path}/unit/:unitid`}>
        <Detailsv2 canAdd={create} />
      </Route>
      <Route path={`${path}/settlement/:trx_code`}>
        <BillingRecord canUpdate={update} canAdd={create} canDelete={del} />
      </Route>
      <Route path={`${path}/settlement`}>
        <Settlement canUpdate={update} canAdd={create} canDelete={del} />
      </Route>
    </Switch>
  );
}

export default Component;
