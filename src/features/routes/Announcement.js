import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import Add from '../add/Announcement';
import Details from '../details/Announcement';

import List from '../list/Announcement';

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
            <Route path={`${path}/details`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;