import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Add from './Add';
import Details from './Details';
import DetailsItem from './DetailsItem';
import RouteSettlement from './RouteSettlement';
import RouteDisbursement from './RouteDisbursement';
import { getBillingUnit, getBillingUnitDetails } from './slice';
import { endpointAdmin } from '../../settings';
import { get, toSentenceCase } from '../../utils';

const columns = [
    // { Header: 'ID', accessor: 'code' },
    { Header: 'ID', accessor: 'id' },
    {
        Header: 'Unit', accessor: row => toSentenceCase(row.section_type) + ' '
            + row.section_name + ' ' + row.number
    },
    { Header: 'Building', accessor: 'building_name' },
    { Header: 'Resident', accessor: row => row.resident_name ? row.resident_name : '-' },
    { Header: 'Unpaid Amount', accessor: 'unpaid_amount' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.billing);

    const [search, setSearch] = useState('');

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

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

    return (
        <div>
            <Switch>
                <Redirect exact from={path} to={`${path}/unit`} />
                <Route path={`${path}/unit`}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBillingUnit(headers, pageIndex, pageSize, search,
                                building));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, building])}
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
                <Route path={`${path}/item/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/item/details`}>
                    <DetailsItem />
                </Route>
                <Route path={`${path}/item`}>
                    <Details />
                </Route>
                <Route path={`${path}/settlement`}>
                    <RouteSettlement />
                </Route>
                <Route path={`${path}/disbursement`}>
                    <RouteDisbursement />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
