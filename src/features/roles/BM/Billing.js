import React, { useState } from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import { useSelector } from "react-redux";

import List from "../../list/Billing";

function Component() {
  let { path } = useRouteMatch();
  const page = "billing";
  const activeModuleAccess = useSelector((state) => state.auth.access);
  const [read, setRead] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [del, setDel] = useState(false);
  if (
    typeof activeModuleAccess.unmapped !== "undefined" &&
    activeModuleAccess.unmapped.length > 0
  ) {
    let access = activeModuleAccess.unmapped.filter((item) => {
      return item.value === page;
    });
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
        default:
          setRead(true);
      }
    });
  }

  return (
    <Switch>
      <Redirect exact from={path} to={`${path}/unit`} />
      
      {read && (
        <Route exact path={`${path}/unit`}>
          <List canAdd={create} canUpdate={update} canDelete={del} />
        </Route>
      )}
    </Switch>
  );
}

export default Component;
