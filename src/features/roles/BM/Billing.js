import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Add from '../../form/Billing';
import Details from '../../details/Billing';
import DetailsItem from '../../details/BillingItem';
import Settlement from '../../settlement/Billing';
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
            <Route path={`${path}/edit`}>
                <Add />
            </Route>
            <Redirect exact from={`${path}/unit/item/record`} to={`${path}/unit/item`} />
            <Route path={`${path}/unit/item/record/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/unit/item/details/edit`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/item/details/:id`}>
                <DetailsItem />
            </Route>
            <Route path={`${path}/unit/item/add`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/item`}>
                <Details />
            </Route>
            <Route path={`${path}/settlement/:trx_code`}>
                <BillingRecord />
            </Route>
            <Route path={`${path}/settlement`}>
                <Settlement />
            </Route>
        </Switch>
    )
}

export default Component;
