import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Add from './Add';
import Details from './Details';
import { getAnnoucement } from './slice';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Title', accessor: 'title' },
    { Header: 'Topic', accessor: 'topic' },
    { Header: 'Consumer', accessor: 'consumer_role' },
    { Header: 'Description', accessor: row => row.description.length > 100 ?
     row.description.slice(0, 100) + '...' : row.description },
    { Header: 'Publisher', accessor: 'publisher' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, alert } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getAnnoucement(headers, pageIndex, pageSize, search));
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
        </div>
    )
}

export default Component;