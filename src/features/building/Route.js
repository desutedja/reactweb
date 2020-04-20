import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBuilding } from './slice';

import Table from '../../components/Table';
import Button from '../../components/Button';

import Add from './Add';
import { FiPlus } from 'react-icons/fi';

const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner Name', accessor: 'owner_name' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Website', accessor: 'website' },
    { Header: 'Location', accessor: row => row.lat + ', ' + row.long },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.building);

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
                            dispatch(getBuilding(headers, pageIndex, pageSize, search));
                        }, [dispatch, headers])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => history.push(url + "/add")}
                            />
                        ]}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;