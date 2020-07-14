import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident, addSubaccount, editResident } from '../slices/resident';
import { toSentenceCase } from '../../utils';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';
import { Badge } from 'reactstrap';
import { get, post } from '../slice';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { residentSchema } from "./schemas";
import Input from './input';

const residentPayload = {
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthplace: "",
    birthdate: "",
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
    account_number: "",

    birthplace_label: "Others",
    nationality_label: "",
    marital_status_label: "",
    occupation_label: "",
    province_label: "",
    city_label: "",
    district_label: "",
    account_bank_label: "",
}

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
    const { loading, selected } = useSelector(state => state.resident);

    const [step, setStep] = useState(2);
    const [resident, setResident] = useState({});
    const [residents, setResidents] = useState([]);
    const [residentsPage, setResidentsPage] = useState('');
    const [loadingResident, setLoadingResident] = useState(false);
    const [emailRegistered, setEmailRegistered] = useState(false);

    const [unitID, setUnitID] = useState('');
    const [units, setUnits] = useState([]);

    const [exist, setExist] = useState(selected.id ? false : true);
    const [sub, setSub] = useState({});

    const [modal, setModal] = useState(false);

    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const [bcities, setBCities] = useState([]);
    const [bcloading, setBCLoading] = useState(true);

    const [nat, setNat] = useState('');

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
        (province || selected.province) && dispatch(get(endpointResident + '/geo/province/' + (province),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
    }, [dispatch, province, selected.province]);

    useEffect(() => {
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city),

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

    const getResident = useCallback((pageIndex, pageSize, search) => {
        setLoadingResident(true);
        dispatch(get(endpointResident + '/management/resident/read' +
            '?page=' + (pageIndex + 1) +
            '&limit=' + pageSize +
            '&search=' + search +
            '&status=',

            res => {
                setResidents(res.data.data.items);
                setResidentsPage(res.data.data.total_pages);

                setLoadingResident(false)
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(get(endpointResident + '/management/resident/unit' +
            '?page=' + 1 +
            '&id=' + resident.id +
            '&limit=' + 10 +
            '&search=',

            res => {
                setUnits(res.data.data.items);
            }
        ))
    }, [dispatch, resident])

    return (
        <Template
            slice="resident"
            payload={selected.id ? {
                ...residentPayload, ...selected,
                phone: selected.phone.slice(2),
                birthdate: selected.birthdate.split('T')[0],
            } : residentPayload}
            schema={residentSchema}
            formatValues={values => ({
                ...values,
                phone: '62' + values.phone,
                birthdate: values.birthdate + ' 00:00:00',
            })}
            edit={data => dispatch(editResident(data, history, selected.id))}
            add={data => dispatch(createResident(data, history))}
            renderChild={props => {
                const { values } = props;

                return (
                    <Form className="Form">
                        <Modal title={"Add Resident"} okLabel={"Yes"}
                            isOpen={modal} toggle={() => setModal(false)} onClick={() => setStep(2)}>
                            {step === 1 && <p>
                                Resident with the provided email already exist.
                                Add as sub account to another resident?
                                </p>}
                            {step === 2 && <>
                                <p className="Title" style={{
                                    marginBottom: 16
                                }}>Select Resident</p>
                                <Table
                                    columns={columns}
                                    data={residents}
                                    loading={loadingResident}
                                    pageCount={residentsPage}
                                    fetchData={getResident}
                                    onClickResolve={row => {
                                        setResident(row);
                                        setStep(3);
                                    }}
                                />
                                <Button label="Back" secondary
                                    onClick={() => setStep(1)}
                                />
                            </>}
                            {step === 3 && <>
                                <p style={{ marginBottom: 16 }}>Add as sub account to
                                    {' ' + resident.firstname + ' ' + resident.lastname + ' '}
                                    in</p>
                                <Input label="Unit" type="select" options={units.map(el => ({
                                    label: el.number,
                                    value: el.unit_id
                                }))} inputValue={unitID} setInputValue={setUnitID} />
                                <div style={{ marginTop: 16 }} />
                                {unitID && <Input type="button" label="Add as Subaccount" compact
                                    onClick={() => {
                                        dispatch(addSubaccount({
                                            unit_id: parseInt(unitID),
                                            parent_id: resident.id,
                                            owner_id: sub.id,
                                            level: 'sub',
                                        }, history));
                                        history.goBack();
                                    }}
                                />}
                            </>}
                        </Modal>

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
                                        setSub(res.data.data);
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
                            <Input {...props} label="Phone" prefix="+62" />
                            <SectionSeparator />

                            <Input {...props} label="Nationality" options={countries}
                            />
                            <Input {...props} label="Birth Place" name="birthplace" options={bcities}
                                loading={bcloading}
                            />
                            <Input {...props} label="Birth Date" name="birthdate" type="date" />
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
                            <Input {...props} label="Account Number" />
                            <Input {...props} label="Account Name" />
                            <button onClick={() => {
                                console.log(values);
                            }}>Submit</button>
                        </>}
                    </Form>
                )
            }}
        />
    )
}

export default Component;
