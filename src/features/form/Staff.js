import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import SectionSeparator from '../../components/SectionSeparator';
import { editStaff, createStaff } from '../slices/staff';
import { endpointResident, endpointAdmin, endpointManagement } from '../../settings';
import { get } from '../slice';
import Template from './components/TemplateWithFormik';
import countries from '../../countries';

import { Form } from 'formik';
import Input from './input';
import { staffSchema } from "./services/schemas";
import SubmitButton from './components/SubmitButton';

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

let staff_roles = [
    { value: 'gm_bm', label: 'GM BM' },
    { value: 'pic_bm', label: 'PIC BM' },
    { value: 'technician', label: 'Technician' },
    { value: 'courier', label: 'Courier' },
    { value: 'security', label: 'Security' },
];

function Component() {
    const initialMount = useRef(true);
    const { banks } = useSelector(state => state.main);
    const { loading, selected } = useSelector(state => state.staff);
    const { role, user } = useSelector(state => state.auth)
    const [bManagements, setBManagements] = useState([]);
    const [bmId, setBmId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [typeDepartment, setTypeDepartment] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    const [districts, setDistricts] = useState([]);
    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        console.log(selectedDepartment)
    }, [selectedDepartment])

    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false;
            return;
        }
        if (bmId && typeDepartment) {
            dispatch(get(endpointManagement + '/admin/department?' +
            'bm_id=' + bmId +
            '&type=' + typeDepartment,
            res => {
                const formatted = res.data.data.map(el => ({
                    label: el.department_name, value: el.id
                }))
                setDepartments(formatted || []);
            }
            ))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bmId, typeDepartment])

    useEffect(() => {
        dispatch(get(endpointAdmin + '/management/building' +
            '?limit=10&page=1' +
            '&search=', res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.building_name + ' by ' + el.management_name,
                    value: el.id
                }));

                setBManagements(formatted);
            }))
    }, [dispatch]);

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
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city ? city : selected.city),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
    }, [city, dispatch, selected.city]);

    useEffect(() => {
        if (role === 'bm') {
            const blacklist_modules = user.blacklist_modules;
            const isSecurity = blacklist_modules.find(item => item.module === 'security') ? true : false;
            const isInternalCourier = blacklist_modules.find(item => item.module === 'internal_courier') ? true : false;
            const isTechnician = blacklist_modules.find(item => item.module === 'technician') ? true : false;

            if (isTechnician) delete staff_roles[2];
            if (isInternalCourier) delete staff_roles[3];
            if (isSecurity) delete staff_roles[4];
        }
    }, [role, user])

    return (
        <Template
            slice="staff"
            payload={selected.id ? {
                ...staffPayload, ...selected,
                phone: selected.phone.slice(2),
                on_centratama: parseInt(selected.on_centratama) ? selected.on_centratama + '' : '0',
                staff_specialization: selected.staff_specialization ? selected.staff_specialization : '',
            } : staffPayload}
            schema={staffSchema}
            formatValues={values => ({
                ...values,
                on_centratama: parseInt(values.on_centratama, 10),
                phone: '62' + values.phone,
                province: parseInt(values.province, 10),
                city: parseInt(values.city, 10),
                district: parseInt(values.district, 10),
                building_management_id: values.building_management_id ?
                    values.building_management_id : user.building_management_id,
            })}
            edit={data => {
                delete data[undefined]
                dispatch(editStaff(data, history, selected.id))
            }}
            add={data => {
                delete data[undefined]
                dispatch(createStaff(data, history))
            }}
            renderChild={props => {
                const { values, errors } = props;
                if (values.building_management_id) setBmId(values.building_management_id);
                if (values.staff_role === 'technician' || values.staff_role === 'pic_bm') setTypeDepartment('service');
                if (values.staff_role === 'security') setTypeDepartment('security');

                return (<Form className="Form">
                    {!selected.id && <Input {...props} label="Staff Role"
                        options={staff_roles}
                    />}
                    {values['staff_role'] === "courier" && <Input {...props} label="On Centratama?"
                        name="on_centratama"
                        type="radio"
                        options={[
                            { value: '1', label: 'Yes' },
                            { value: '0', label: 'No' },
                        ]} />}
                    {/* {values['staff_role'] === "technician" && <Input {...props} label="Specialization"
                        name="staff_specialization"
                        options={[
                            { value: 'electricity', label: 'Electricity' },
                            { value: 'plumbing', label: 'Plumbing' },
                            { value: 'others', label: 'Others' },
                        ]} />} */}
                    {role === 'sa' && <Input {...props} label="Building Management"
                        name="building_management_id"
                        options={bManagements}
                    />}
                    {(values['staff_role'] === "technician" || values['staff_role'] === "security" || values['staff_role'] === "pic_bm") && <Input {...props}
                        type="multiselect" label="Select Department(s)"
                        name="department_ids" defaultValue={values.departments.map(el => ({
                            label: el.department_name, value: el.id
                        }))}
                        placeholder="Start typing department name to add" options={departments}
                        onChange={(e, value) => {
                            setSelectedDepartment(value);
                        }}
                    />}
                    <Input {...props} label="Staff Id" placeholder="KTP/SIM/Passport" />
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

                    <Input {...props} label="Account Bank" optional options={banks} />
                    <Input {...props} label="Account Number" optional />
                    <Input {...props} label="Account Name" optional />
                    <SubmitButton loading={loading} errors={errors} />
                </Form>
                )
            }}
        />
    )
}

export default Component;