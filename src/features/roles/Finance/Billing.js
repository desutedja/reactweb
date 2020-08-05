import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Settlement from '../../settlement/Billing';
import Disbursement from '../../disbursement/Billing';
import BillingRecord from '../../details/BillingRecord';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Redirect exact from={path} to={`${path}/settlement`} />
            <Route path={`${path}/settlement/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/settlement`}>
                <Settlement />
            </Route>
            <Route path={`${path}/disbursement/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/disbursement`}>
                <Disbursement />
            </Route>
        </Switch>
    )
}

export default Component;
