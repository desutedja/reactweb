import React, { } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { useSelector } from 'react-redux';

import List from '../../list/Staff';
import Details from '../../details/Staff';

function Component() {
    const { blacklist_modules } = useSelector(state => state.auth.user);
    let { path } = useRouteMatch();
    console.log(blacklist_modules)
    return (
        <Switch>
            <Route exact path={path}>
                <List />
            </Route>
            <Route path={`${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;
