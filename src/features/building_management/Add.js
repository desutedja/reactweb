import React, { useState, useEffect } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createBuildingManagement, editBuildingManagement } from './slice';
import { get } from '../../utils';
import { endpointAdmin, banks } from '../../settings';

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
                    inputValue={buildingID ? buildingID : selected.building_id}
                    setInputValue={setBuildingID}
                />
                <Input label="Building Name" hidden
                    inputValue={buildingName ? buildingName : selected.building_name}
                    setInputValue={setBuildingName}
                />
                <Input label="Select Building" type="button"
                    inputValue={buildingName ? buildingName : selected.building_name}
                    onClick={() => setModalBuilding(true)}
                />
                <Input label="Management ID" hidden
                    inputValue={managementID ? managementID : selected.management_id}
                    setInputValue={setManagementID}
                />
                <Input label="Management Name" hidden
                    inputValue={managementName ? managementName : selected.management_name}
                    setInputValue={setManagementName}
                />
                <Input label="Select Management" type="button"
                    inputValue={managementName ? managementName : selected.management_name}
                    onClick={() => setModalManagement(true)}
                />
                <Input label="Status" type="select" inputValue={selected.status}
                    options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                    ]} />
                <SectionSeparator />
                <Input label="Settlement Bank"  type="select" options={banks} inputValue={selected.settlement_bank} />
                <Input label="Settlement Account No" inputValue={selected.settlement_account_no} />
                <Input label="Settlement Account Name"
                    inputValue={selected.settlement_account_name} />
                <SectionSeparator />
                <Input label="Billing Published (Date)" name="billing_published" type="number"
                    inputValue={selected.billing_published}
                />
                <Input label="Billing Due (Date)" name="billing_duedate" type="number"
                    inputValue={selected.billing_duedate} />
                <Input label="Penalty Fee" type="number"
                    inputValue={selected.penalty_fee} />
                <SectionSeparator />
                <Input label="Courier Fee" type="number"
                    inputValue={selected.courier_fee}
                />
                <Input label="Courier Internal Markup" type="number"
                    inputValue={selected.courier_internal_markup}
                />
                <Input label="Courier External Markup" type="number"
                    inputValue={selected.courier_external_markup}
                />
            </Form>
        </div>
    )
}

export default Component;