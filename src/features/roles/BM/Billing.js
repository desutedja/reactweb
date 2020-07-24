import React, { } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import Add from '../../form/Billing';
import Details from '../../details/Billing';
import DetailsItem from '../../details/BillingItem';
import Settlement from '../../settlement/Billing';

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
            <Route path={`${path}/unit/item/add`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/item/edit`}>
                <Add />
            </Route>
            <Route path={`${path}/unit/item/details`}>
                <DetailsItem />
            </Route>
            <Route path={`${path}/unit/item`}>
                <Details />
            </Route>
            <Route path={`${path}/settlement`}>
                <Settlement />
            </Route>
        </Switch>
    )
}

export default Component;
