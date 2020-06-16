import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import Task from './Task';
import Billing from './Billing';
import Advertisement from './Advertisement';

import './style.css';

function Component() {
    let { path } = useRouteMatch();

    return (
        <div>
            <Switch>
                {/* <Redirect from={path} to={`${path}/task`} /> */}
                <Route exact path={`${path}/task`}>
                    <Task />
                </Route>
                <Route path={`${path}/advertisement`}>
                    <Advertisement />
                </Route>
                <Route path={`${path}/billing`}>
                    <Billing />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;