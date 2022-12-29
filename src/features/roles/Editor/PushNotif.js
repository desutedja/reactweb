import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import List from '../../feature/PushNotification/list/PushNotif';
import Add from '../../feature/PushNotification/Form/PushNotif';
import Edit from '../../feature/PushNotification/Form/PushNotifEdit';
import Details from '../../feature/PushNotification/Detail';

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
                <Edit />
            </Route>
            <Route path={`${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;
