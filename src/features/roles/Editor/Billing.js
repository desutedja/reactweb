import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import List from '../../list/Billing';
import ListBonus from '../../list/Bonus';

function Component() {
    let { path } = useRouteMatch();

    return (
       
        <Switch>
            <Redirect exact from={path} to={`${path}/list`} />
            <Route exact path={`${path}/list`}>
                <List />
            </Route>
            <Route exact path={`${path}/bonus`}>
                <ListBonus />
            </Route>
        </Switch>
    )
}

export default Component;
