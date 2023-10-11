import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import List from '../../list/Billing';

function Component() {
    let { path } = useRouteMatch();

    return (
       
        <Switch>
            <Redirect exact from={path} to={`${path}/list`} />
            <Route exact path={`${path}/list`}>
                <List />
            </Route>
        </Switch>
    )
}

export default Component;
