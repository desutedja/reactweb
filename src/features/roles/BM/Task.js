import React, { useEffect, useState } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getBuildingUnit } from "../../slices/building";

import Add from "../../form/Task";
import List from "../../list/Task";
import Details from "../../details/Task";

function Component() {
  const dispatch = useDispatch();

  const { role, user } = useSelector((state) => state.auth);
  const row = {
    id: user.building_id,
  };
  let { path } = useRouteMatch();

  useEffect(() => {
    dispatch(getBuildingUnit(0, 100, "", row, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const page = "resident";
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
      {role === "bm" && create && (
        <Route exact path={`${path}/add`}>
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
