import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Add from './Add';
import Details from './Details';
import { getBilling } from './slice';
import { FiSearch } from 'react-icons/fi';
import { endpointAdmin } from '../../settings';
import { get, months } from '../../utils';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Resident', accessor: 'resident_name' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Group', accessor: 'group' },
    { Header: 'Remarks', accessor: 'remarks' },
    { Header: 'Subtotal', accessor: 'subtotal' },
    {
        Header: 'Tax', accessor: row => row.tax === 'percentage' ?
            (row.tax_value + '%') : row.tax_amount
    },
    { Header: 'Additional Charges', accessor: row => 0 },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Due Date', accessor: 'due_date' },
    { Header: 'Payment Date', accessor: row => row.payment_date ? row.payment_date : '-' },
    { Header: 'Settlement Date', accessor: row => row.settlement_date ? row.settlement_date : '-' },
    { Header: 'Disbursement Date', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle, alert } = useSelector(state => state.billing);

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
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBilling(headers, pageIndex, pageSize, search,
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
                            {
                                button: <Button key="Select Unit"
                                    label={unit ? unitName : "Select Unit"}
                                    selected={unit}
                                />,
                                component: (toggleModal) =>
                                    !building ?
                                        <p>Please select building first.</p>
                                        :
                                        <>
                                            <Input
                                                label="Search"
                                                compact
                                                icon={<FiSearch />}
                                                inputValue={search}
                                                setInputValue={setSearch}
                                            />
                                            <Filter
                                                data={units}
                                                onClick={(el) => {
                                                    setUnit(el.value);
                                                    setUnitName(el.label);
                                                    toggleModal(false);
                                                    setSearch("");
                                                }}
                                                onClickAll={() => {
                                                    setUnit("");
                                                    setUnitName("");
                                                    toggleModal(false);
                                                    setSearch("");
                                                }}
                                            />
                                        </>
                            },
                            {
                                button: <Button key="Select Month"
                                    label={month ? monthName : "Select Month"}
                                    selected={month}
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
                                            data={months}
                                            onClick={(el) => {
                                                setMonth(el.value);
                                                setMonthName(el.label);
                                                toggleModal(false);
                                                setSearch("");
                                            }}
                                            onClickAll={() => {
                                                setMonth("");
                                                setMonthName("");
                                                toggleModal(false);
                                                setSearch("");
                                            }}
                                        />
                                    </>
                            },
                            {
                                button: <Button key="Select Year"
                                    label={yearSet ? yearSet : "Select Year"}
                                    selected={yearSet}
                                />,
                                component: (toggleModal) =>
                                    <form style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }} onSubmit={() => {
                                        setYearSet(year);
                                        toggleModal(false);
                                    }}>
                                        <Input
                                            label="Year"
                                            type="number"
                                            max={new Date().getFullYear()}
                                            inputValue={year}
                                            setInputValue={setYear}
                                        />
                                        <Button label="Set" />
                                    </form>
                            },
                        ]}
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