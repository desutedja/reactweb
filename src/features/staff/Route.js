import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getStaff } from './slice';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import { FiSearch } from 'react-icons/fi';
import { endpointAdmin } from '../../settings';
import { get } from '../../utils';

const columns = [
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Role", accessor: "staff_role" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Gender", accessor: "gender" },
    { Header: "On Shift", accessor: "on_shift" },
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
    const [search, setSearch] = useState('');
    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [role, setRole] = useState('');
    const [roleLabel, setRoleLabel] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.staff);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        search.length >= 3 && get(endpointAdmin + '/building' +
        '?limit=5&page=1' +
        '&search=' + search, headers, res => {
            let data = res.data.data.items;

            let formatted = data.map(el => ({label: el.name, value: el.id}));

            setBuildings(formatted);
        })
    }, [search]);

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
                            dispatch(getStaff(headers, pageIndex, pageSize, search, role, building));
                        }, [dispatch, headers, role, building])}
                        filters={[
                            {
                                button: <Button key="Select Building"
                                    label={building ? buildingName : "Select Building"}
                                    selected={building}
                                />,
                                component: (toggleModal) =>
                                    <>
                                        <Input
                                            label="Search"
                                            compact
                                            icon={<FiSearch />}
                                            inputValue={search}
                                            setInputValue={setSearch}
                                        />
                                        <Filter
                                            data={buildings}
                                            onClick={(el) => {
                                                setBuilding(el.value);
                                                setBuildingName(el.label);
                                                toggleModal(false);
                                            }}
                                            onClickAll={() => {
                                                setBuilding("");
                                                setBuildingName("");
                                                toggleModal(false);
                                            }}
                                        />
                                    </>
                            },
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
                            },
                        ]}
                        actions={[]}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;