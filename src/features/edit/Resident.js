import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Breadcrumb from '../../components/Breadcrumb';
import SectionSeparator from '../../components/SectionSeparator';
import { editResident } from '../slices/resident';
import { getCountryFromCode } from '../../utils';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';
import { get } from '../slice';

function Component() {
    const [email, setEmail] = useState('');

    const [district, setDistrict] = useState("");
    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const [bcity, setBCity] = useState("");
    const [bcities, setBCities] = useState([]);
    const [bcloading, setBCLoading] = useState(true);

    const [nat, setNat] = useState("");

    const { loading, selected } = useSelector(state => state.resident);

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
        <div>
            <Breadcrumb title="Edit" />
            <Form
                showSubmit={!!selected.id}
                onSubmit={data => dispatch(editResident(data, history, selected.id))}
                loading={loading}
            >
                <div style={{
                    width: '100%'
                }}>
                    <Input label="Email" placeholder={"Input Resident Email"} type="email" inputValue={email ? email : selected.email}
                        setInputValue={setEmail} disabled={selected.id} />
                    <SectionSeparator />
                </div>
                {(selected.email) && <>
                    <Input label="First Name" name="firstname" inputValue={selected.firstname} />
                    <Input label="Last Name" name="lastname" inputValue={selected.lastname} />
                    <Input label="Phone" type="tel" inputValue={selected.phone} />
                    <Select label="Birth Place" name="birthplace" options={bcities}
                        inputValue={bcity ? bcity.value : selected.birthplace} setInputValue={setBCity}
                        loading={bcloading}
                    />
                    <Input label="Birth Date" name="birthdate" type="date"
                        inputValue={selected.birthdate?.split('T')[0]} />
                    <SectionSeparator />
                    <Select label="Nationality" options={countries}
                        inputValue={nat ? nat.label : getCountryFromCode(selected.nationality)}
                        setInputValue={setNat}
                    />
                    <Input hidden name="nationality" inputValue={nat ? nat.value : selected.nationality} />
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
                    <Input label="Occupation" type="select" options={[
                        { value: 'unemployed', label: 'Unemployed' },
                        { value: 'student', label: 'Student' },
                        { value: 'university_student', label: 'University Student' },
                        { value: 'professional', label: 'Professional' },
                        { value: 'housewife', label: 'Housewife' },
                    ]} inputValue={selected.occupation} />
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
                </>}
            </Form>
        </div>
    )
}

export default Component;
