import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Add from './Add';
import Details from './Details';
import DetailsItem from './DetailsItem';
import Settlement from './Settlement';
import Disbursement from './Disbursement';
import { getBillingUnit, getBillingUnitDetails } from '../slices/billing';
import { endpointAdmin } from '../../settings';
import { toSentenceCase, toMoney } from '../../utils';
import { get } from '../slice';

const columns = [
    // { Header: 'ID', accessor: 'code' },
    { Header: 'ID', accessor: 'id' },
    {
        Header: 'Unit', accessor: row => toSentenceCase(row.section_type) + ' '
            + row.section_name + ' ' + row.number
    },
    { Header: 'Building', accessor: 'building_name' },
    { Header: 'Resident', accessor: row => row.resident_name ? row.resident_name : '-' },
    { Header: 'Unpaid Amount', accessor: row => toMoney(row.unpaid_amount) },
]

function Component() {
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
            '&search=' + search,  res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [ search]);

    return (
        <div>
            <Switch>
                <Redirect exact from={path} to={`${path}/unit`} />
                <Route exact path={`${path}/unit`}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBillingUnit( pageIndex, pageSize, search,
                                building));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle,  building])}
                        filters={[
                            {
                                hidex: building === "",
                                label: <p>Building: {building ? buildingName : "All"}</p>,
                                delete: () => setBuilding(''),
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
                            dispatch(getBillingUnitDetails(row,  history, url))
                        }}
                    />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/unit/item/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/unit/item/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/unit/item/details`}>
                    <DetailsItem />
                </Route>
                <Route path={`${path}/unit/item`}>
                    <Details />
                </Route>
                <Route path={`${path}/settlement`}>
                    <Settlement />
                </Route>
                <Route path={`${path}/disbursement`}>
                    <Disbursement />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
