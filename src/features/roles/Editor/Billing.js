import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Add from '../../form/Billing';
import Detailsv2 from '../../details/Billingv2';
import DetailsItem from '../../details/BillingItem';
import Settlement from '../../settlement/Billing';
import Disbursement from '../../disbursement/Billing';
import BillingRecord from '../../details/BillingRecord';

import List from '../../list/Billing';
import ListCategory from '../../list/BillingCategory';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Redirect exact from={path} to={`${path}/unit`} />
            <Route exact path={`${path}/unit`}>
                <List />
            </Route>
            <Route exact path={`${path}/category`}>
                <ListCategory />
            </Route>
            <Route path={`${path}/edit`}>
                <Add />
            </Route>
            <Redirect exact from={`${path}/unit/:unitid/record`} to={`${path}/unit/:unitid`} />
            <Route path={`${path}/unit/:unitid/record/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/unit/:unitid/edit`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/:unitid/add`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/:unitid/:id`}>
                <DetailsItem />
            </Route>
            <Route path={`${path}/unit/:unitid`}>
                <Detailsv2 />
            </Route>
            {/*
            <Route path={`${path}/unit/item/details/edit`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/item/details/:id`}>
                <DetailsItem />
            </Route>
            <Route path={`${path}/unit/item/add`}>
                <Add />
            </Route>
            <Route path={`${path}/details/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/unit/item`}>
                <Details />
            </Route>
            */}
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
