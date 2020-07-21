import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import List from '../../list/Admin';
import AdminDetails from '../../details/Admin';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <List />
            </Route>
            <Route path={`${path}/:id`}>
                <AdminDetails />
            </Route>
        </Switch>
    )
}

export default Component;
