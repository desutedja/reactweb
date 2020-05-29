import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Add from './Add';
import Details from './Details';
import DetailsItem from './DetailsItem';
import { getBillingUnit, getBillingUnitDetails } from './slice';
import { endpointAdmin } from '../../settings';
import { get, months, dateTimeFormatter, dateFormatter } from '../../utils';

const columns = [
    { Header: 'ID', accessor: 'code' },
    { Header: 'Unit', accessor: 'resident_unit' },
    { Header: 'Building', accessor: 'building_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    { Header: 'Unpaid Amount', accessor: 'billing_amount' },
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
                            dispatch(getBillingUnit(headers, pageIndex, pageSize, search,
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
                            // {
                            //     button: <Button key="Select Unit"
                            //         label={unit ? unitName : "Select Unit"}
                            //         selected={unit}
                            //     />,
                            //     component: (toggleModal) =>
                            //         !building ?
                            //             <p>Please select building first.</p>
                            //             :
                            //             <>
                            //                 <Input
                            //                     label="Search"
                            //                     compact
                            //                     icon={<FiSearch />}
                            //                     inputValue={search}
                            //                     setInputValue={setSearch}
                            //                 />
                            //                 <Filter
                            //                     data={units}
                            //                     onClick={(el) => {
                            //                         setUnit(el.value);
                            //                         setUnitName(el.label);
                            //                         toggleModal(false);
                            //                         setSearch("");
                            //                     }}
                            //                     onClickAll={() => {
                            //                         setUnit("");
                            //                         setUnitName("");
                            //                         toggleModal(false);
                            //                         setSearch("");
                            //                     }}
                            //                 />
                            //             </>
                            // },
                            // {
                            //     button: <Button key="Select Month"
                            //         label={month ? monthName : "Select Month"}
                            //         selected={month}
                            //     />,
                            //     component: (toggleModal) =>
                            //         <>
                            //             <Input
                            //                 label="Search"
                            //                 compact
                            //                 icon={<FiSearch />}
                            //                 inputValue={search}
                            //                 setInputValue={setSearch}
                            //             />
                            //             <Filter
                            //                 data={months}
                            //                 onClick={(el) => {
                            //                     setMonth(el.value);
                            //                     setMonthName(el.label);
                            //                     toggleModal(false);
                            //                     setSearch("");
                            //                 }}
                            //                 onClickAll={() => {
                            //                     setMonth("");
                            //                     setMonthName("");
                            //                     toggleModal(false);
                            //                     setSearch("");
                            //                 }}
                            //             />
                            //         </>
                            // },
                            // {
                            //     button: <Button key="Select Year"
                            //         label={yearSet ? yearSet : "Select Year"}
                            //         selected={yearSet}
                            //     />,
                            //     component: (toggleModal) =>
                            //         <form style={{
                            //             display: 'flex',
                            //             flexDirection: 'column',
                            //             alignItems: 'center',
                            //         }} onSubmit={() => {
                            //             setYearSet(year);
                            //             toggleModal(false);
                            //         }}>
                            //             <Input
                            //                 label="Year"
                            //                 type="number"
                            //                 max={new Date().getFullYear()}
                            //                 inputValue={year}
                            //                 setInputValue={setYear}
                            //             />
                            //             <Button label="Set" />
                            //         </form>
                            // },
                        ]}
                        actions={[]}
                        onClickDetails={row => {
                            dispatch(getBillingUnitDetails(row, headers, history, url))
                        }}
                    />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/item/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/item/details`}>
                    <DetailsItem />
                </Route>
                <Route path={`${path}/item`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;