import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Pills from '../../components/Pills';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident, editResident, addSubaccount } from './slice';
import { post, get, toSentenceCase } from '../../utils';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Nationality", accessor: "nationality" },
    {
        Header: "Status", accessor: row => row.status ?
            <Pills color="limegreen">{toSentenceCase(row.status)}</Pills>
            :
            <Pills color="crimson">Inactive</Pills>
    },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ? row.status_kyc :
            <Pills color="crimson">None</Pills>
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

    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);

    const [email, setEmail] = useState('');
    const [searchRes, setSearchRes] = useState('');

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
    }, [headers, search]);

    // useEffect(() => {
    //     get(endpointResident + '/management/resident/unit?id=' + selected.id +
    //         '&limit=10&page=1' +
    //         '&search=' + search, headers, res => {
    //             let data = res.data.data.items;

    //             let formatted = data.map(el => ({
    //                 label: el.building_name + ' by ' + el.management_name,
    //                 value: el.id
    //             }));

    //             setUnits(formatted);
    //         })
    // }, [headers, search, selected.id]);

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
            '&search=' + search,
            headers,
            res => {
                setUnits(res.data.data.items);
            }
        )
    }, [headers, resident, search])

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                {step === 1 && <>
                    <p>Resident with the provided email already exist.</p>
                    <p style={{ marginBottom: 16 }}>Add as sub account to another resident?</p>
                    <div style={{
                        display: 'flex'
                    }}>
                        <Button secondary label="Cancel" onClick={() => setModal(false)} />
                        <Button label="Yes" onClick={() => setStep(2)} />
                    </div>
                </>}
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
                showSubmit={!exist || !!selected.id}
                onSubmit={data => selected.id ?
                    dispatch(editResident(headers, data, history, selected.id))
                    :
                    dispatch(createResident(headers, data, history))}
                loading={loading}
            >
                <div style={{
                    width: '100%'
                }}>
                    <Input label="Email" type="email" inputValue={email ? email : selected.email}
                        setInputValue={setEmail} disabled={selected.id} />
                    {!selected.id && exist && <Input label="Check" type="button" compact
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
                {(!exist || selected.email) && <>
                    <Input label="First Name" name="firstname" inputValue={selected.firstname} />
                    <Input label="Last Name" name="lastname" inputValue={selected.lastname} />
                    <Input label="Phone" type="tel" inputValue={selected.phone} />
                    <Select label="Birth Place" name="birthplace" options={bcities}
                        inputValue={bcity ? bcity : selected.birthplace} setInputValue={setBCity}
                        loading={bcloading}
                    />
                    <Input label="Birth Date" name="birthdate" type="date"
                        inputValue={selected.birthdate?.split('T')[0]} />
                    <SectionSeparator />
                    <Select label="Nationality" options={countries}
                        inputValue={nat ? nat : selected.nationality}
                        setInputValue={setNat}
                    />
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