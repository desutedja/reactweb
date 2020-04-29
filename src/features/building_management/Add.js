import React, { useState, useEffect } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createBuildingManagement, editBuildingManagement } from './slice';
import { FiSearch } from 'react-icons/fi';
import { get } from '../../utils';
import { endpointAdmin } from '../../settings';

function Component() {
    const [buildingID, setBuildingID] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState([]);

    const [managementID, setManagementID] = useState('');
    const [managementName, setManagementName] = useState('');
    const [managements, setManagements] = useState([]);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.building_management);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        get(endpointAdmin + '/building' +
        '?limit=5&page=1' +
        '&search=' + buildingName, headers, res => {
            let data = res.data.data.items;

            let formatted = data.map(el => ({label: el.name, value: el.id}));

            setBuildings(formatted);
        })
    }, [headers, buildingName]);

    useEffect(() => {
        get(endpointAdmin + '/management' +
        '?limit=5&page=1' +
        '&search=' + managementName, headers, res => {
            let data = res.data.data.items;

            let formatted = data.map(el => ({label: el.name, value: el.id}));

            setManagements(formatted);
        })
    }, [headers, managementName]);

    useEffect(() => {
        
    }, [buildingName, managementName])

    return (
        <div>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editBuildingManagement(headers, data, history, selected.id))
                    :
                    dispatch(createBuildingManagement(headers, data, history))}
                loading={loading}
            >
                <Input label="Building ID" hidden />
                <Input label="Building Name" type="searchable" options={buildings} icon={<FiSearch />}
                    inputValue={buildingName} setInputValue={setBuildingName}
                />
                <Input label="Management ID" hidden />
                <Input label="Management Name" type="searchable" options={managements} icon={<FiSearch />} />
                <Input label="Status" type="select" options={[
                    {label: 'Active', value: 'active'},
                    {label: 'Inactive', value: 'inactive'},
                ]} />
                <SectionSeparator />
                <Input label="Settlement Bank" />
                <Input label="Settlement Account" type="number" />
                <Input label="Settlement Account Name" />
                <SectionSeparator />
                <Input label="Billing Published (Date)" name="billing_published" type="number"  />
                <Input label="Billing Due (Date)" name="billing_duedate" type="number" />
                <Input label="Penalty Fee" type="number" />
                <SectionSeparator />
                <Input label="Courier Fee" type="number" />
            </Form>
        </div>
    )
}

export default Component;