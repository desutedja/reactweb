import React, { } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import List from '../../list/Resident';
import Details from '../../details/Resident';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <List view />
            </Route>
            <Route path={`${path}/:id`}>
                <Details view />
            </Route>
        </Switch>
    )
}

export default Component;
