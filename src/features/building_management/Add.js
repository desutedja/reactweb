import React, { useState, useEffect } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
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

    const [search, setSearch] = useState('');
    const [modalBuilding, setModalBuilding] = useState(false);
    const [modalManagement, setModalManagement] = useState(false);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.building_management);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        (!search || search >= 3) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        (!search || search >= 3) && get(endpointAdmin + '/management' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setManagements(formatted);
            })
    }, [headers, search]);

    return (
        <div>
            <Modal isOpen={modalBuilding} onRequestClose={() => setModalBuilding(false)}>
                <Input label="Search"
                    inputValue={search} setInputValue={setSearch}
                />
                <Filter
                    data={buildings}
                    onClick={(el) => {
                        setBuildingID(el.value);
                        setBuildingName(el.label);
                        setModalBuilding(false);
                    }}
                />
            </Modal>
            <Modal isOpen={modalManagement} onRequestClose={() => setModalManagement(false)}>
                <Input label="Search"
                    inputValue={search} setInputValue={setSearch}
                />
                <Filter
                    data={managements}
                    onClick={(el) => {
                        setManagementID(el.value);
                        setManagementName(el.label);
                        setModalManagement(false);
                    }}
                />
            </Modal>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editBuildingManagement(headers, data, history, selected.id))
                    :
                    dispatch(createBuildingManagement(headers, data, history))}
                loading={loading}
            >
                <Input label="Building ID" hidden
                    inputValue={buildingID} setInputValue={setBuildingID}
                />
                <Input label="Building Name" hidden
                    inputValue={buildingName} setInputValue={setBuildingName}
                />
                <Input label="Select Building" type="button" inputValue={buildingName}
                    onClick={() => setModalBuilding(true)}
                />
                <Input label="Management ID" hidden
                    inputValue={managementID} setInputValue={setManagementID}
                />
                <Input label="Management Name" hidden
                    inputValue={managementName} setInputValue={setManagementName}
                />
                <Input label="Select Management" type="button" inputValue={managementName}
                    onClick={() => setModalManagement(true)}
                />
                <Input label="Status" type="select" options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                ]} />
                <SectionSeparator />
                <Input label="Settlement Bank" />
                <Input label="Settlement Account" type="number" />
                <Input label="Settlement Account Name" />
                <SectionSeparator />
                <Input label="Billing Published (Date)" name="billing_published" type="number" />
                <Input label="Billing Due (Date)" name="billing_duedate" type="number" />
                <Input label="Penalty Fee" type="number" />
                <SectionSeparator />
                <Input label="Courier Fee" type="number" />
            </Form>
        </div>
    )
}

export default Component;