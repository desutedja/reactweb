import React, { useEffect, useState } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editStaff, createStaff } from './slice';
import { endpointResident, endpointAdmin } from '../../settings';
import { get } from '../../utils';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.staff);

    const [bManagementID, setBManagementID] = useState('');
    const [bManagementName, setBManagementName] = useState('');
    const [bManagements, setBManagements] = useState([]);

    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);

    const [district, setDistrict] = useState("");
    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        (!search || search >= 3) && get(endpointAdmin + '/management/building' +
            '?limit=10&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.building_name + ' by ' + el.management_name,
                    value: el.id
                }));

                setBManagements(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        get(endpointResident + '/geo/province',
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setProvinces(formatted);
            }
        )
    }, [headers]);

    useEffect(() => {
        setCity("");
        (province || selected.province) && get(endpointResident + '/geo/province/' + (province ? province : selected.province),
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        )
    }, [headers, province, selected.province]);

    useEffect(() => {
        setDistrict("");
        (city || selected.city) && get(endpointResident + '/geo/city/' + (city ? city : selected.city),
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        )
    }, [headers, city, selected.city]);

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <Input label="Search"
                    inputValue={search} setInputValue={setSearch}
                />
                <Filter
                    data={bManagements}
                    onClick={(el) => {
                        setBManagementID(el.value);
                        setBManagementName(el.label);
                        setModal(false);
                    }}
                />
            </Modal>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editStaff(headers, data, history, selected.id))
                    :
                    dispatch(createStaff(headers, data, history))}
                loading={loading}
            >
                <Input label="Firstname" inputValue={selected.firstname} />
                <Input label="Lastname" inputValue={selected.lastname} />
                <Input label="Email" type="email" inputValue={selected.email} />
                <Input label="Phone" type="tel" inputValue={selected.phone} />
                <SectionSeparator />

                <Input label="Nationality" inputValue={selected.nationality} />
                <Input label="Gender" type="select" options={[
                    { value: 'P', label: 'Perempuan' },
                    { value: 'L', label: 'Laki-Laki' },
                ]} inputValue={selected.gender} />
                <Input label="Marital Status" type="select" options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorce', label: 'Divorced' },
                    { value: 'other', label: 'Other' },
                ]} inputValue={selected.marital_status} />
                <SectionSeparator />

                <Input label="Building Management ID" hidden
                    inputValue={bManagementID ? bManagementID : selected.building_management_id}
                    setInputValue={setBManagementID}
                />
                <Input label="Building Management Name" hidden
                    inputValue={bManagementName ? bManagementName : selected.id ?
                        selected.building_name + ' by ' + selected.management_name : null}
                    setInputValue={setBManagementName}
                />
                <Input label="Select Building Management" type="button"
                    inputValue={bManagementName ? bManagementName : selected.id ?
                        selected.building_name + ' by ' + selected.management_name : null}
                    onClick={() => setModal(true)}
                />
                <Input label="Is Internal?" type="select"
                    name="on_centratama"
                    options={[
                        { value: 1, label: 'Yes' },
                        { value: 0, label: 'No' },
                    ]} inputValue={selected.on_centratama} />
                <SectionSeparator />

                <Input label="Staff ID" inputValue={selected.staff_id} />
                <Input label="Staff Role" type="select" options={[
                    { value: 'gm_bm', label: 'GM BM' },
                    { value: 'pic_bm', label: 'PIC BM' },
                    { value: 'technician', label: 'Technician' },
                    { value: 'courier', label: 'Courier' },
                    { value: 'security', label: 'Security' },
                ]} inputValue={selected.staff_role} />
                <Input label="Status" type="select" options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ]} inputValue={selected.status} />
                <SectionSeparator />

                <Input label="Address" type="textarea" inputValue={selected.address} />
                <Input label="Province" type="select" options={provinces}
                    inputValue={province ? province : selected.province} setInputValue={setProvince}
                />
                <Input label="City" type="select" options={cities}
                    inputValue={city ? city : selected.city} setInputValue={setCity}
                />
                <Input label="District" type="select" options={districts}
                    inputValue={district ? district : selected.district} setInputValue={setDistrict}
                />
                <SectionSeparator />

                <Input label="Account Bank" inputValue={selected.account_bank} />
                <Input label="Account Number" inputValue={selected.account_no} />
                <Input label="Account Name"
                    inputValue={selected.account_name} />
            </Form>
        </div>
    )
}

export default Component;