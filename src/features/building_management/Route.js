import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiX } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import { getBuildingManagement, setSelected, deleteBuildingMangement, setAlert, getBuildingManagementDetails } from './slice';
import Add from './Add';
import Details from './Details';

const columns = [
    { Header: "Building", accessor: "building_name" },
    { Header: "Management", accessor: "management_name" },
    { Header: "Billing Published", accessor: "billing_published" },
    { Header: "Billing Due", accessor: "billing_duedate" },
    { Header: "Penalty Fee", accessor: "penalty_fee" },
    { Header: "Courier Fee", accessor: "courier_fee" },
    { Header: "Status", accessor: "status" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, alert } = useSelector(state => state.building_management);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    {alert.message && <div className={"Alert " + alert.type}>
                        <p>{alert.message}</p>
                        <IconButton onClick={() => dispatch(setAlert({}))}>
                            <FiX />
                        </IconButton>
                    </div>}
                    <Table totalItems={total_items}
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
                        onClickDelete={row => dispatch(deleteBuildingMangement(row, headers))}
                        onClickDetails={row => dispatch(getBuildingManagementDetails(row, headers, history, url))}
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