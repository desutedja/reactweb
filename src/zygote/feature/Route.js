import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Add from './Add';
import Details from './Details';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle, alert } = useSelector(state => state.name);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Table
                    columns={columns}
                    data={[]}
                    loading={true}
                    pageCount={1}
                    fetchData={useCallback((pageIndex, pageSize, search) => {

                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, headers])}
                    filters={[]}
                    actions={[]}
                />
            </Route>
            <Route path={`${path}/add`}>
                <Add />
            </Route>
            <Route path={`${path}/edit`}>
                <Add />
            </Route>
            <Route path={`${path}/details`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default Component;