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
import { post, get, toSentenceCase } from '../../utils';
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
    const { loading } = useSelector(state => state.resident);

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
        (province) && get(endpointResident + '/geo/province/' + (province),
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        )
    }, [headers, province]);

    useEffect(() => {
        setDistrict("");
        (city) && get(endpointResident + '/geo/city/' + (city),
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        )
    }, [headers, city]);

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
                            dispatch(addSubaccount(headers, {
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
            <Form
                showSubmit={!exist}
                onSubmit={data => dispatch(createResident(headers, data, history))}
                loading={loading}
            >
                <div style={{
                    width: '100%'
                }}>
                    <Input label="Email" placeholder={"Input Resident Email"} type="email" compact inputValue={email}
                        setInputValue={setEmail} />
                    {exist && <Input label="Check" type="button" compact
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
                {(!exist) && <>
                    <Input label="First Name" name="firstname" />
                    <Input label="Last Name" name="lastname"  />
                    <Input label="Phone" type="tel"  />
                    <Select label="Birth Place" name="birthplace" options={bcities}
                        inputValue={bcity.value} setInputValue={setBCity}
                        loading={bcloading}
                    />
                    <Input label="Birth Date" name="birthdate" type="date" />
                    <SectionSeparator />
                    <Select label="Nationality" options={countries}
                        setInputValue={setNat} inputValue={nat.label}
                    />
                    <Input hidden name="nationality" inputValue={nat.value} />
                    <Input label="Gender" type="select" options={[
                        { value: 'P', label: 'Perempuan' },
                        { value: 'L', label: 'Laki-Laki' },
                    ]}  />
                    <Input label="Marital Status" type="select" options={[
                        { value: 'single', label: 'Single' },
                        { value: 'married', label: 'Married' },
                        { value: 'divorce', label: 'Divorced' },
                        { value: 'other', label: 'Other' },
                    ]}  />
                    <Input label="Occupation" type="select" options={[
                        { value: 'unemployed', label: 'Unemployed' },
                        { value: 'student', label: 'Student' },
                        { value: 'university_student', label: 'University Student' },
                        { value: 'professional', label: 'Professional' },
                        { value: 'housewife', label: 'Housewife' },
                    ]}  />
                    <SectionSeparator />

                    <Input label="Address" type="textarea"  />
                    <Input label="Province" type="select" options={provinces}
                        inputValue={province} setInputValue={setProvince}
                    />
                    <Input label="City" type="select" options={cities}
                        inputValue={city} setInputValue={setCity}
                    />
                    <Input label="District" type="select" options={districts}
                        inputValue={district} setInputValue={setDistrict}
                    />
                    <SectionSeparator />

                    <Input label="Account Bank" type="select" options={banks}  />
                    <Input label="Account Number"  />
                    <Input label="Account Name"
                         />
                </>}
            </Form>
        </div>
    )
}

export default Component;
