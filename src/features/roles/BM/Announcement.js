import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import Add from '../../form/BM/Announcement';
import Details from '../../details/Announcement';

import List from '../../list/Announcement';
import View from '../../details/Announcement/View';

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
            <Route exact path={`${path}/:id`}>
                <Details />
            </Route>
            <Route path={`${path}/:id/view`}>
                <View />
            </Route>
        </Switch>
    )
}

export default Component;
