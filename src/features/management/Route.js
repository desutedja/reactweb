import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getManagement, deleteManagement, getManagementDetails } from './slice';
import { FiPlus } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Add from './Add';
import Details from './Details';

const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Legal Name", accessor: "name_legal" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Website", accessor: "website" },
    { Header: "PIC Name", accessor: "pic_name" },
    { Header: "PIC Phone", accessor: "pic_phone" },
    { Header: "PIC Email", accessor: "pic_email" },
    { Header: "Logo", accessor: "logo" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle } = useSelector(state => state.management);

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
                            dispatch(getManagement(headers, pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, headers, refreshToggle])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => history.push(url + "/add")}
                            />
                        ]}
                        onClickDelete={rowID => dispatch(deleteManagement(rowID, headers))}
                        onClickRow={rowID => dispatch(getManagementDetails(rowID, headers, history, url))}
                    />
                </Route>
                <Route path={`${path}/add`}>
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