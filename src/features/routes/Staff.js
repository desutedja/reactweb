import React, { } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import Add from '../form/Staff';
import List from '../list/Staff';
import Details from '../details/Staff';

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
    )
}

export default Component;
