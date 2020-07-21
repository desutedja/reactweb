import React, {  } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import List from '../../list/Building';
import Add from '../../form/Building';
import Details from '../../details/Building';

function Component() {
    const { auth } = useSelector(state => state)
    const buildingId = auth.user.building_management_id;

    let { path } = useRouteMatch();

    return (
        <Switch>
            {auth.role === 'sa' ? <Route exact path={path}>
                <List />
            </Route> : <Route exact path={path}> 
                <Redirect exact from={path} to={`${path}/${buildingId}`} />
            </Route>}
            <Route path={`${path}/add`}>
                <Add />
            </Route>
            <Route path={`${path}/edit`}>
                <Add />
            </Route>
            <Route exact path={`${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;
