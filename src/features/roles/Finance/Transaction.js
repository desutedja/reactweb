import React, {  } from 'react';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import List from '../../list/Transaction';
import Settlement from '../../settlement/Transaction';
import Disbursement from '../../disbursement/Transaction';
import Details from '../../details/Transaction';

function Component() {
    
    let { path } = useRouteMatch();

    return (
            <Switch>
                <Redirect exact from={path} to={`${path}/settlement`} />
                <Route path={`${path}/list`}>
                    <List />
                </Route>
                <Route path={`${path}/settlement`}>
                    <Settlement />
                </Route>
                <Route path={`${path}/disbursement`}>
                    <Disbursement />
                </Route>
                <Route path={`${path}/:id`}>
                    <Details />
                </Route>
            </Switch>
    )
}

export default Component;
