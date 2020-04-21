import React, { useEffect, useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import { getResident } from './slice';

const columns = [
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Status", accessor: "status" },
    { Header: "KYC Status", accessor: "status_kyc" },
    { Header: "Remarks", accessor: "remarks" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getResident(headers, pageIndex, pageSize, search));
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