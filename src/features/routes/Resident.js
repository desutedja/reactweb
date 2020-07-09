import React, { } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import List from '../list/Resident';
import Add from '../form/Resident';
import Edit from '../edit/Resident';
import AddSub from '../form/ResidentSub';
import Details from '../details/Resident';

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
                <Route path={`${path}/edit`}>
                    <Edit />
                </Route>
                <Route path={`${path}/add-subaccount`}>
                    <AddSub />
                </Route>
                <Route path={`${path}/:id`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
