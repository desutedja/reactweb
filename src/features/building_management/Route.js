import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import { getBuildingManagement, setSelected } from './slice';
import Add from './Add';
import { FiPlus } from 'react-icons/fi';
// import Details from './Details';

const columns = [
    { Header: "Management", accessor: "management_name" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Billing Published", accessor: "billing_published" },
    { Header: "Billing Due", accessor: "billing_duedate" },
    { Header: "Penalty Fee", accessor: "penalty_fee" },
    { Header: "Courier Fee", accessor: "courier_fee" },
    { Header: "Status", accessor: "status" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle, alert } = useSelector(state => state.building_management);

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
                            dispatch(getBuildingManagement(headers, pageIndex, pageSize, search))
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                {/* <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route> */}
            </Switch>
        </div>
    )
}

export default Component;