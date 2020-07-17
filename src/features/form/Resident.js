import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import SectionSeparator from '../../components/SectionSeparator';
import { createResident, editResident } from '../slices/resident';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';
import { get, post } from '../slice';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { residentSchema } from "./schemas";
import Input from './input';
import SubmitButton from './components/SubmitButton';

const residentPayload = {
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthplace: "",
    birth_date: "",
    nationality: "",
    gender: "P",
    marital_status: "",
    occupation: "",
    address: "",
    province: "",
    city: "",
    district: "",
    account_bank: "",
    account_name: "",
    account_no: "",

    birthplace_label: "",
    nationality_label: "",
    marital_status_label: "",
    occupation_label: "",
    province_label: "",
    city_label: "",
    district_label: "",
    account_bank_label: "",
}

function Component() {
    const { selected, loading } = useSelector(state => state.resident);

    const [emailRegistered, setEmailRegistered] = useState(false);
    const [exist, setExist] = useState(selected.id ? false : true);

    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const [bcities, setBCities] = useState([]);
    const [bcloading, setBCLoading] = useState(true);

    let dispatch = useDispatch();
    let history = useHistory();

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
        (province || selected.province) && dispatch(get(endpointResident + '/geo/province/' + (province || selected.province),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
    }, [dispatch, province, selected.province]);

    useEffect(() => {
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city || selected.city),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
    }, [city, dispatch, selected.city]);

    useEffect(() => {
        setBCLoading(true);
        dispatch(get(endpointResident + '/geo/province',

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.name }));
                console.log(formatted)

                setBCities(formatted);
                setBCLoading(false);
            }
        ))
    }, [dispatch]);

    return (
        <Template
            slice="resident"
            payload={selected.id ? {
                ...residentPayload, ...selected,
                phone: selected.phone.slice(3),
                birth_date: selected.birth_date.split('T')[0],
            } : residentPayload}
            schema={residentSchema}
            formatValues={values => ({
                ...values,
                phone: '628' + values.phone,
                birth_date: values.birth_date + ' 00:00:00',
            })}
            edit={data => dispatch(editResident(data, history, selected.id))}
            add={data => dispatch(createResident(data, history))}
            renderChild={props => {
                const { values, errors } = props;

                return (
                    <Form className="Form">
                        <Input {...props} onFocus={() => setEmailRegistered(false)} label="Email"
                            placeholder={"Input Resident Email"} type="email" compact disabled={!exist} />
                        {emailRegistered && <span style={{
                            marginBottom: 12
                        }} className="validation-error">Email is already registered</span>}
                        {exist && <button
                            type="button"
                            onClick={() => {
                                dispatch(post(endpointResident + '/management/resident/check', {
                                    email: values.email
                                },
                                    res => {
                                        res.data.data.id
                                            ?
                                            setEmailRegistered(true)
                                            :
                                            setExist(false)
                                    },
                                ))
                            }}
                            disabled={!values.email}
                        >
                            Check
                            </button>}
                        <SectionSeparator />

                        {(!exist) && <>
                            <Input {...props} label="First Name" name="firstname" />
                            <Input {...props} label="Last Name" name="lastname" />
                            <Input {...props} label="Phone" prefix="+628" />
                            <SectionSeparator />

                            <Input {...props} label="Nationality" options={countries}
                            />
                            <Input {...props} label="Birth Place" name="birthplace" options={bcities}
                                loading={bcloading}
                            />
                            <Input {...props} label="Birth Date" name="birth_date" type="date" />
                            <Input {...props} hidden name="nationality" />
                            <Input {...props} label="Gender" type="radio" options={[
                                { value: 'P', label: 'Female' },
                                { value: 'L', label: 'Male' },
                            ]} />
                            <Input {...props} label="Marital Status" options={[
                                { value: 'single', label: 'Single' },
                                { value: 'married', label: 'Married' },
                                { value: 'divorce', label: 'Divorced' },
                                { value: 'other', label: 'Other' },
                            ]} />
                            <Input {...props} label="Occupation" options={[
                                { value: 'unemployed', label: 'Unemployed' },
                                { value: 'student', label: 'Student' },
                                { value: 'university_student', label: 'University Student' },
                                { value: 'professional', label: 'Professional' },
                                { value: 'housewife', label: 'Housewife' },
                            ]} />
                            <SectionSeparator />

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
                            <Input {...props} label="Account Number" name="account_no" />
                            <Input {...props} label="Account Name" />
                            <SubmitButton loading={loading} errors={errors} />
                        </>}
                    </Form>
                )
            }}
        />
    )
}

export default Component;
