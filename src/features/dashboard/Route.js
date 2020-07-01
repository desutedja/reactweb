import React, {  } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Task from './Task';
import Transaction from './Transaction';
import Billing from './Billing';
import Advertisement from './Advertisement';

import './style.css';

function Component() {
    let { path } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Redirect exact from={path} to={`${path}/task`} />
                <Route path={`${path}/task`}>
                    <Task />
                </Route>
                <Route path={`${path}/advertisement`}>
                    <Advertisement />
                </Route>
                <Route path={`${path}/billing`}>
                    <Billing />
                </Route>
                <Route path={`${path}/transaction`}>
                    <Transaction />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;