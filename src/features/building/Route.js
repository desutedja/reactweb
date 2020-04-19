import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import List from './List';
import Add from './Add';

function Component() {
    let { path } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <List />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;