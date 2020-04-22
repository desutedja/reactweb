import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getStaff } from './slice';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';

const columns = [
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Role", accessor: "staff_role" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Availability", accessor: "is_available" },
    { Header: "Is Internal", accessor: "on_centratama" },
    { Header: "On Shift", accessor: "on_shift" },
    { Header: "On Shift Until", accessor: "on_shift_until" },
    { Header: "Status", accessor: "status" },
]

const roles = [
    { label: 'GM BM', value: 'gm_bm' },
    { label: 'PIC BM', value: 'pic_bm' },
    { label: 'Technician', value: 'technician' },
    { label: 'Courier', value: 'courier' },
    { label: 'Security', value: 'security' }
];

function Component() {
    const [role, setRole] = useState('');
    const [roleLabel, setRoleLabel] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.staff);

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
                            dispatch(getStaff(headers, pageIndex, pageSize, search, role));
                        }, [dispatch, headers, role])}
                        filters={[
                            {
                                button: <Button key="Select Role"
                                    label={role ? roleLabel : "Select Role"}
                                    selected={role}
                                />,
                                component: toggleModal =>
                                    <Filter
                                        data={roles}
                                        onClickAll={() => {
                                            setRole("");
                                            setRoleLabel("");
                                            toggleModal(false);
                                        }}
                                        onClick={el => {
                                            setRole(el.value);
                                            setRoleLabel(el.label);
                                            toggleModal(false);
                                        }}
                                    />
                            }
                        ]}
                        actions={[]}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;