import React, { useEffect } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getBuildingUnit } from '../../slices/building';

import Add from '../../form/Task';
import List from '../../list/Task';
import Details from '../../details/Task';

function Component() {
    const dispatch = useDispatch();

    const { role, user } = useSelector(state => state.auth);
    const row = {
        id: user.building_id
    }
    let { path } = useRouteMatch();

    useEffect(() => {
        dispatch(getBuildingUnit(0, 100, '', row));
    }, [])

    return (
        <Switch>
            <Route exact path={path}>
                <List />
            </Route>
            {role === 'bm' && <Route path={`${path}/add`}>
                <Add />
            </Route>}
            <Route path={`${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;
