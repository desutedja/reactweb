import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.name);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={[]}
                        loading={true}
                        pageCount={1}
                        fetchData={useCallback((pageIndex, pageSize, search) => {

                        }, [dispatch, headers])}
                        filters={[]}
                        actions={[]}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;