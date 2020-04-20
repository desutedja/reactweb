import React, { useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {

    }, []);

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table columns={columns} data={[]} loading={true}
                        actions={[]}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;