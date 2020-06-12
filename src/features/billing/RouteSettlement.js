import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import { getBillingUnitDetails, getBillingSettlement } from './slice';
import { endpointAdmin } from '../../settings';
import { get, toMoney } from '../../utils';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Building', accessor: 'building_name' },
    { Header: 'Unit', accessor: 'unit_id' },
    { Header: 'Management', accessor: 'management_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
    { Header: 'Settlement', accessor: row => row.payment_settled_date ? row.payment_settled_date : '-' },
    { Header: 'Disbursement', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, settlement, refreshToggle, alert } = useSelector(state => state.billing);

    const [search, setSearch] = useState('');

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [unit, setUnit] = useState('');
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState('');

    const [month, setMonth] = useState('');
    const [monthName, setMonthName] = useState('');

    const [year, setYear] = useState('');
    const [yearSet, setYearSet] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        building && (!search || search.length >= 3) && get(endpointAdmin + '/building/unit' +
            '?limit=5&page=1' +
            '&building_id=' + building +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: `${el.unit_type_name}-${el.unit_size} 
                    ${el.section_name} F${el.floor} ${el.number}`,
                    value: el.id
                }));

                setUnits(formatted);
            })
    }, [headers, search, building]);

    return (
        <div>
            <Switch>
                {/* <Redirect exact from={path} to={`${path}`} /> */}
                <Route path={`${path}`}>
                    <Table totalItems={settlement.total_items}
                        columns={columns}
                        data={settlement.items}
                        loading={loading}
                        pageCount={settlement.total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBillingSettlement(headers, pageIndex, pageSize, search,
                                building, unit, month, yearSet));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, building, unit, month, yearSet])}
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
                                                setSearch("");
                                            }}
                                            onClickAll={() => {
                                                setBuilding("");
                                                setBuildingName("");
                                                toggleModal(false);
                                                setSearch("");
                                            }}
                                        />
                                    </>
                            },
                        ]}
                        actions={[]}
                        // onClickDetails={row => {
                        //     dispatch(getBillingUnitDetails(row, headers, history, url))
                        // }}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;