import React, {  } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import List from '../../list/Xenplatform';
// import Add from '../../form/Building';
import Details from '../../details/Building';

function Component() {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <List />
            </Route>
            
            <Route path={`${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;
