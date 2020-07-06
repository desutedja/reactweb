import React, { useState, useEffect, useMemo } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Input from '../../components/Input';
import Filter from '../../components/Filter';
import { getBillingUnit, getBillingUnitDetails } from '../slices/billing';
import { endpointAdmin } from '../../settings';
import { toSentenceCase, toMoney } from '../../utils';
import { get } from '../slice';

import Template from './components/Template';
import Building from '../../components/cells/Building';
import Resident from '../../components/cells/Resident';

function Component() {
    const [search, setSearch] = useState('');

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const columns = useMemo(() => [
        {
            Header: 'Unit', accessor: row =>
                <div className="Item" onClick={() => {
                    dispatch(getBillingUnitDetails(row, history, url))
                }}>
                    <div>
                        <b>Nomor {row.number}</b>
                        <p className="Item-subtext">{toSentenceCase(row.section_type) + ' '
                            + row.section_name}</p>
                    </div>
                </div>
    
        },
        { Header: 'Building', accessor: row => <Building id={row.building_id} /> },
        { Header: 'Resident', accessor: row => <Resident id={row.resident_id} /> },
        {
            Header: 'Unpaid Amount', accessor: row => row.unpaid_amount ? <b style={{
                fontSize: '1.2rem'
            }}>{toMoney(row.unpaid_amount)}</b> : '-'
        },
    ], [dispatch, history, url]);

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [search]);

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
        />
    )
}

export default Component;
