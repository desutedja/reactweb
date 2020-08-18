import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Details from '../../details/Billing';
import Detailsv2 from '../../details/Billingv2';
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
            <Route exact path={`${path}/unit`}>
                <List />
            </Route>
            <Redirect exact from={`${path}/unit/:unitid/record`} to={`${path}/unit/:unitid`} />
            <Route path={`${path}/unit/:unitid/record/:trx_code`}>
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
            <Route path={`${path}/unit/:unitid/:id`}>
                <DetailsItem view/>
            </Route>
            <Route path={`${path}/unit/:unitid`}>
                <Detailsv2 view/>
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
