import React, { useState } from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";

import { useSelector } from "react-redux";

import Add from "../../form/Staff";
import List from "../../list/Staff";
import Details from "../../details/Staff";

function Component() {
  let { path } = useRouteMatch();

  const page = "staff";
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
      return item.value == page;
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
      }
    });
  }
  return (
    <Switch>
      {create && (
        <Route exact path={`${path}/add`}>
          <Add />
        </Route>
      )}
      {update && (
        <Route exact path={`${path}/edit`}>
          <Add />
        </Route>
      )}
      {read && (
        <>
          <Route exact path={path}>
            <List canDelete={del} canAdd={create} canUpdate={update} />
          </Route>
          <Route exact path={`${path}/:id`}>
            <Details canDelete={del} canAdd={create} canUpdate={update} />
          </Route>
        </>
      )}
    </Switch>
  );
}

export default Component;
