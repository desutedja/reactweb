import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import SectionSeparator from '../../components/SectionSeparator';
import { editStaff, createStaff } from '../slices/staff';
import { endpointResident, endpointAdmin, banks } from '../../settings';
import { get } from '../slice';
import Template from './components/TemplateWithFormik';
import countries from '../../countries';

import { Form } from 'formik';
import Input from './input';
import { staffSchema } from "./schemas";

const staffPayload = {
    staff_role: "",
    on_centratama: '1',
    staff_specialization: "",
    building_management_id: "",
    staff_id: "",
    status: "active",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nationality: "",
    gender: 'P',
    marital_status: "",
    address: "",
    province: "",
    city: "",
    district: "",
    account_bank: "",
    account_number: "",
    account_name: "",

    staff_role_label: "",
    staff_specialization_label: "",
    building_management_id_label: "",
    nationality_label: "",
    marital_status_label: "",
    province_label: "",
    city_label: "",
    district_label: "",
    account_bank_label: "",
}

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

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        (!search || search >= 3) && dispatch(get(endpointAdmin + '/management/building' +
            '?limit=10&page=1' +
            '&search=' + search, res => {
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
        <Template
            slice="staff"
            payload={selected.id ? {...staffPayload, ...selected} : staffPayload}
            schema={staffSchema}
            formatValues={values => ({
                ...values,
                on_centratama: parseInt(values.on_centratama, 10),
                phone: '62' + values.phone,
                province: parseInt(values.province, 10),
                city: parseInt(values.city, 10),
                district: parseInt(values.district, 10),
            })}
            edit={data => dispatch(editStaff(data, history, selected.id))}
            add={data => dispatch(createStaff(data, history))}
            renderChild={props => {
                const { values } = props;

                return (<Form className="Form">
                            {!selected.id && <Input {...props} label="Staff Role"
                                options={[
                                    { value: 'gm_bm', label: 'GM BM' },
                                    { value: 'pic_bm', label: 'PIC BM' },
                                    { value: 'technician', label: 'Technician' },
                                    { value: 'courier', label: 'Courier' },
                                    { value: 'security', label: 'Security' },
                                ]}
                            />}
                            {values['staff_role'] === "courier" && <Input {...props} label="On Centratama?"
                                name="on_centratama"
                                type="radio"
                                options={[
                                    { value: '1', label: 'Yes' },
                                    { value: '0', label: 'No' },
                                ]} />}
                            {values['staff_role'] === "technician" && <Input {...props} label="Specialization"
                                name="staff_specialization"
                                options={[
                                    { value: 'electricity', label: 'Electricity' },
                                    { value: 'plumbing', label: 'Plumbing' },
                                    { value: 'billing', label: 'Billing' },
                                    { value: 'others', label: 'Others' },
                                ]} />}
                            <Input {...props} label="Building Management"
                                name="building_management_id"
                                options={bManagements}
                            />
                            <Input {...props} label="Staff ID" />
                            <Input {...props} label="Status"
                                type="radio"
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                            />

                            <SectionSeparator />

                            <Input {...props} label="Firstname" />
                            <Input {...props} label="Lastname" />
                            <Input {...props} label="Email" />
                            <Input {...props} label="Phone" prefix="+62" />

                            <SectionSeparator />

                            <Input {...props} label="Nationality" options={countries} />
                            <Input {...props} label="Gender"
                                type="radio"
                                options={[
                                    { value: 'P', label: 'Female' },
                                    { value: 'L', label: 'Male' },
                                ]}
                            />
                            <Input {...props}
                                label="Marital Status"
                                options={[
                                    { value: 'single', label: 'Single' },
                                    { value: 'married', label: 'Married' },
                                    { value: 'divorce', label: 'Divorced' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                            <Input {...props} label="Address" type="textarea" />
                            <Input {...props} label="Province" options={provinces}
                                onChange={el => setProvince(el.value)}
                            />
                            {values.province && <Input {...props} label="City" options={cities}
                                onChange={el => setCity(el.value)}
                            />}
                            {values.city && <Input {...props} label="District"
                                options={districts} />}

                            <SectionSeparator />

                            <Input {...props} label="Account Bank" options={banks} />
                            <Input {...props} label="Account Number" />
                            <Input {...props} label="Account Name" />
                            {!loading &&
                                <button type="submit"
                                    onClick={() => console.log(values)}
                                >
                                    Submit
                            </button>
                            }
                        </Form>
                )
            }}
        />
    )
}

export default Component;