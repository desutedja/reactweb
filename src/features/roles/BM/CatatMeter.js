import React, { useState} from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { useSelector } from "react-redux";
import NotFound from "../../../components/NotFound";

import List from '../../list/CatatMeter';

function Component() {
    let { path } = useRouteMatch();
    const [read, setRead] = useState(false);
    const activeModuleAccess = useSelector((state) => state.auth.access);
    const page = "catatmeter";

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
          }
        });
      }

    return (
        <Switch>
        {read && (
            <>
                <Route exact path={path}>
                    <List />
                </Route>
            </>
        )}
        {!read && (
            <>
              <Route path="*">
                <NotFound />
              </Route>
            </>
        )}
        </Switch>
    )
}

export default Component;
