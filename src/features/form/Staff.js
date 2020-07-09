import React, { useEffect, useState } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editStaff, createStaff } from '../slices/staff';
import { endpointResident, endpointAdmin, banks } from '../../settings';
import { get } from '../slice';
import Template from './components/Template';
import countries from '../../countries';

function Component() {
    const { loading, selected } = useSelector(state => state.staff);
    const [validation, setValidation] = useState({
        tel: {
            value: '',
            isErr: false
        }
    })

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

    const [role, setRole] = useState("");

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        (!search || search >= 3) && dispatch(get(endpointAdmin + '/management/building' +
            '?limit=10&page=1' +
            '&search=' + search,  res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.building_name + ' by ' + el.management_name,
                    value: el.id
                }));

                setBManagements(formatted);
            }))
    }, [dispatch, search]);

    useEffect(() => {
        dispatch(get(endpointResident + '/geo/province',
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setProvinces(formatted);
            }
        ))
    }, [dispatch]);

    useEffect(() => {
        setCity("");
        (province || selected.province) && dispatch(get(endpointResident + '/geo/province/' + (province ? province : selected.province),
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
    }, [dispatch, province, selected.province]);

    useEffect(() => {
        setDistrict("");
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city ? city : selected.city),
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
    }, [city, dispatch, selected.city]);

    return (
        <Template>
            <Modal isOpen={modal} toggle={() => setModal(false)}>
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
                    dispatch(editStaff( data, history, selected.id))
                    :
                    dispatch(createStaff( data, history))}
                loading={loading}
            >
                {!selected.id && <Input label="Staff Role" type="select"
                    options={[
                        { value: 'gm_bm', label: 'GM BM' },
                        { value: 'pic_bm', label: 'PIC BM' },
                        { value: 'technician', label: 'Technician' },
                        { value: 'courier', label: 'Courier' },
                        { value: 'security', label: 'Security' },
                    ]}
                    inputValue={role ? role : selected.staff_role}
                    setInputValue={setRole}
                />}
                {role === "courier" && <Input label="On Centratama?" type="select"
                    name="on_centratama"
                    options={[
                        { value: 1, label: 'Yes' },
                        { value: 0, label: 'No' },
                    ]} inputValue={selected.on_centratama} />}
                {role === "technician" && <Input label="Specialization" type="select"
                    name="staff_specialization"
                    options={[
                        { value: 'electricity', label: 'Electricity' },
                        { value: 'plumbing', label: 'Plumbing' },
                        { value: 'billing', label: 'Billing' },
                        { value: 'others', label: 'Others' },
                    ]} inputValue={selected.staff_specialization} />}
                <Input label="Building Management ID" hidden
                    inputValue={bManagementID ? bManagementID : selected.building_management_id}
                    setInputValue={setBManagementID}
                />
                <Input label="Building Management Name" hidden
                    inputValue={bManagementName ? bManagementName : selected.building_management_id ?
                        selected.building_name + ' by ' + selected.management_name : "No Management"}
                    setInputValue={setBManagementName}
                />
                <Input label="Select Building Management" type="button"
                    inputValue={bManagementName ? bManagementName : selected.building_management_id ?
                        selected.building_name + ' by ' + selected.management_name : "No Management"}
                    onClick={() => setModal(true)}
                />
                <Input label="Staff ID" inputValue={selected.staff_id} />
                <Input label="Status" type="select" options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ]} inputValue={selected.status ? selected.status : 'active'} />
                <SectionSeparator />

                <Input label="Firstname" inputValue={selected.firstname} />
                <Input label="Lastname" inputValue={selected.lastname} />
                <Input label="Email" type="email" inputValue={selected.email} />
                <Input label="Phone" type="tel"
                    inputValue={selected.phone || validation.tel.value}
                    placeholder="e.g 6281xxxxxxx"
                    isValidate={validation.tel.isErr}
                    validationMsg="The phone number must begin 62" onFocus={(e) => {
                        setValidation({
                            ...validation,
                            tel: {
                                ...validation.tel,
                                value: '62'
                            }
                        })
                    }}
                    onBlur={(e) => {
                        if (e.target.value.includes(e.target.value.match(/^62/))) {
                            setValidation({
                                ...validation,
                                tel: {
                                    ...validation.tel,
                                    isErr: false
                                }
                            })
                        } else setValidation({
                            ...validation,
                            tel: {
                                ...validation.tel,
                                isErr: true
                            }
                        })
                    }}
                />
                <SectionSeparator />

                <Input label="Nationality" inputValue={selected.nationality} type="select"
                    options={countries}
                />
                <Input label="Gender" type="radio" options={[
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

                <Input label="Account Bank" type="select" options={banks} inputValue={selected.account_bank} />
                <Input label="Account Number" inputValue={selected.account_no} />
                <Input label="Account Name"
                    inputValue={selected.account_name} />
            </Form>
        </Template>
    )
}

export default Component;