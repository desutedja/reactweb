import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Details from '../../details/Billing';
import DetailsItem from '../../details/BillingItem';
import Settlement from '../../settlement/Billing';
import Disbursement from '../../disbursement/Billing';
import BillingRecord from '../../details/BillingRecord';

import List from '../../list/Billing';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Redirect exact from={path} to={`${path}/unit`} />
            <Route path={`${path}/unit/item/record/:trx_code`}>
                <BillingRecord view />
            </Route>
            <Route path={`${path}/details/:trx_code`}>
                <BillingRecord view />
            </Route>
            <Route path={`${path}/settlement/:trx_code`}>
                <BillingRecord view />
            </Route>
            <Route path={`${path}/disbursement/:trx_code`}>
                <BillingRecord view />
            </Route>
            <Route exact path={`${path}/unit`}>
                <List view />
            </Route>
            <Route path={`${path}/unit/item/details`}>
                <DetailsItem view />
            </Route>
            <Route path={`${path}/unit/item`}>
                <Details view />
            </Route>
            <Route path={`${path}/settlement`}>
                <Settlement view />
            </Route>
            <Route path={`${path}/disbursement`}>
                <Disbursement view />
            </Route>
        </Switch>
    )
}

export default Component;
