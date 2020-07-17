import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch, FiDownload, FiPlus } from 'react-icons/fi';

import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Button from '../../components/Button';
import { getBillingUnit, getBillingUnitDetails, downloadBillingUnit, setSelectedUnit } from '../slices/billing';
import { endpointAdmin } from '../../settings';
import { toSentenceCase, toMoney } from '../../utils';
import { get } from '../slice';

import Template from './components/Template';
import { setSelected } from '../slices/resident';

function Component() {

    const [search, setSearch] = useState('');

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        (!search || search.length >= 1) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [search]);

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
        { Header: 'Action', accessor: row => (
            <Button key="Add Billing" label="Add Billing" icon={<FiPlus />}
                onClick={() => {
                    dispatch(setSelected(row));
                    dispatch(setSelectedUnit({}));
                    dispatch(getBillingUnitDetails(row, history, url))
                    history.push(url + '/item/add');
                }}
            />
        ) },
    ]

    return (
        <Template
            columns={columns}
            slice='billing'
            getAction={getBillingUnit}
            filterVars={[building]}
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
            actions={[
                <Button label="Download .csv" icon={<FiDownload />}
                    onClick={() => dispatch(downloadBillingUnit(search, building))}
                />
            ]}
            onClickDetails={row => {
                dispatch(getBillingUnitDetails(row, history, url))
            }}
        />
    )
}

export default Component;
