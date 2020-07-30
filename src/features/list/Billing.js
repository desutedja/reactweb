import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiDownload, FiPlus, FiUpload } from 'react-icons/fi';

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

    const { auth } = useSelector(state => state);

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [limit, setLimit] = useState(5);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building' +
            '?limit=' + limit + '&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;
                let totalItems = Number(res.data.data.total_items);
                let restTotal = totalItems - data.length;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                if (data.length < totalItems && search.length === 0) {
                    formatted.push({
                        label: 'Load ' + (restTotal > 5 ? 5 : restTotal) + ' more',
                        restTotal: restTotal > 5 ? 5 : restTotal,
                        className: 'load-more'
                    })
                }

                setBuildings(formatted);
            }))
    }, [dispatch, search, limit]);

    useEffect(() => {
        if (search.length ===  0) setLimit(5)
    }, [search])

    const columns = [
        // { Header: 'ID', accessor: 'code' },
        { Header: 'Unit ID', accessor: 'id' },
        {
            Header: 'Unit', accessor: row => <span className="Link"
                onClick={() => dispatch(getBillingUnitDetails(row, history, url))} 
            ><b>{toSentenceCase(row.section_type) + ' '
                + row.section_name + ' ' + row.number}</b></span>
        },
        { Header: 'Building', accessor: 'building_name' },
        { Header: 'Resident', accessor: row => row.resident_name ? row.resident_name : '-' },
        { Header: 'Unpaid Amount', accessor: row => <b>{toMoney(row.unpaid_amount)}</b> },
        { Header: 'Additional Charges', accessor: row => <b>{toMoney(row.additional_charge)}</b> },
        { Header: 'Penalty', accessor: row => <b>{toMoney(row.billing_penalty)}</b> },
        { Header: 'Total', accessor: row => <b>{toMoney(row.total)}</b> },
    ]

    return (
        <Template
            pagetitle="Billing List"
            title='Unit'
            columns={columns}
            slice='billing'
            getAction={getBillingUnit}
            filterVars={[building]}
            filters={auth.role === 'sa' ? [
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
                                    if (!el.value) {
                                        setLimit(limit + el.restTotal);
                                        return;
                                    }
                                    setBuilding(el.value);
                                    setBuildingName(el.label);
                                    toggleModal(false);
                                    setSearch("");
                                    setLimit(5);
                                }}
                                onClickAll={() => {
                                    setBuilding("");
                                    setBuildingName("");
                                    toggleModal(false);
                                    setSearch("");
                                    setLimit(5);
                                }}
                            />
                        </>
                },
            ] : []}
            actions={[
                <Button label="Upload Bulk" icon={<FiUpload />}
                    onClick={() => dispatch(downloadBillingUnit(search, building))}
                />,
                <Button label="Download .csv" icon={<FiDownload />}
                    onClick={() => dispatch(downloadBillingUnit(search, building))}
                />,
            ]}
            onClickAddBilling={row => {
                dispatch(setSelected(row));
                dispatch(setSelectedUnit({}));
                dispatch(getBillingUnitDetails(row, history, url))
                history.push(url + '/item/add');
            }}
        />
    )
}

export default Component;
