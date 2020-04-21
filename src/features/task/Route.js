import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import { getTask } from './slice';

const columns = [
    { Header: "Assigned on", accessor: "assigned_on" },
    { Header: "Ref Code", accessor: "ref_code" },
    { Header: "Task Type", accessor: "task_type" },
    { Header: "Requester Name", accessor: "requester_name" },
    { Header: "Priority", accessor: "priority" },
    { Header: "Lokasi", accessor: row => row.r_lat + ", " + row.r_long },
    { Header: "Assigned by", accessor: "assigned_by" },
    { Header: "Remarks", accessor: "remarks" },
    { Header: "Status", accessor: "status" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.task);

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
                            dispatch(getTask(headers, pageIndex, pageSize, search));
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