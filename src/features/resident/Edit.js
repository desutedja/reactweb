import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident, editResident, addSubaccount } from './slice';
import { post, get, toSentenceCase, getCountryFromCode } from '../../utils';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';
import { Badge } from 'reactstrap';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Nationality", accessor: "nationality" },
    {
        Header: "Status", accessor: row => row.status ?
            <h5><Badge pill color="success">{toSentenceCase(row.status)}</Badge></h5>
            :
            <h5><Badge pill color="danger">Inactive</Badge></h5>
    },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ? row.status_kyc :
            <h5><Badge pill color="secondary">None</Badge></h5>
    },
]

function Component() {
    const [step, setStep] = useState(2);
    const [resident, setResident] = useState({});
    const [residents, setResidents] = useState([]);
    const [residentsPage, setResidentsPage] = useState('');
    const [loadingResident, setLoadingResident] = useState(false);

    const [unitID, setUnitID] = useState('');
    const [units, setUnits] = useState([]);

    const [exist, setExist] = useState(true);
    const [sub, setSub] = useState({});

    const [modal, setModal] = useState(false);

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

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();

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

    useEffect(() => {
        setBCLoading(true);
        get(endpointResident + '/geo/province',
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.name }));
                console.log(formatted)

                setBCities(formatted);
                setBCLoading(false);
            }
        )
    }, [headers]);

    const getResident = useCallback((pageIndex, pageSize, search) => {
        setLoadingResident(true);
        get(endpointResident + '/management/resident/read' +
            '?page=' + (pageIndex + 1) +
            '&limit=' + pageSize +
            '&search=' + search +
            '&status=',
            headers,
            res => {
                setResidents(res.data.data.items);
                setResidentsPage(res.data.data.total_pages);

                setLoadingResident(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers]);

    useEffect(() => {
        get(endpointResident + '/management/resident/unit' +
            '?page=' + 1 +
            '&id=' + resident.id +
            '&limit=' + 10 +
            '&search=',
            headers,
            res => {
                setUnits(res.data.data.items);
            }
        )
    }, [headers, resident])

    return (
        <div>
            <Form
                showSubmit={!!selected.id}
                onSubmit={data => dispatch(editResident(headers, data, history, selected.id))}
                loading={loading}
            >
                <div style={{
                    width: '100%'
                }}>
                    <Input label="Email" placeholder={"Input Resident Email"} type="email" inputValue={email ? email : selected.email}
                        setInputValue={setEmail} disabled={selected.id} />
                    {!selected.id && <Input label="Check" type="button" compact
                        onClick={() => {
                            post(endpointResident + '/management/resident/check', {
                                email: email
                            }, headers,
                                res => {
                                    setSub(res.data.data);
                                    res.data.data.id
                                        ?
                                        setModal(true)
                                        :
                                        setExist(false);
                                },
                            )
                        }}
                    />}
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
