import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import SectionSeparator from '../../components/SectionSeparator';
import { addSubaccount, createSubaccount } from './slice';
import { post, get } from '../../utils';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';

function Component() {
    const [exist, setExist] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);

    const [data, setData] = useState({});
    const [status, setStatus] = useState('');

    const [email, setEmail] = useState('');
    const [residents, setResidents] = useState([]);
    const [searchRes, setSearchRes] = useState('');

    const [unitID, setUnitID] = useState('');
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState([]);

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
    const { loading, selected, unit } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        get(endpointResident + '/management/resident/read?limit=20&page=1&search=' + searchRes,
            headers,
            res => {
                setResidents(res.data.data);
            }
        )
    }, [headers, searchRes]);

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
        province && get(endpointResident + '/geo/province/' + province,
            headers,
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        )
    }, [headers, province]);

    useEffect(() => {
        setDistrict("");
        city && get(endpointResident + '/geo/city/' + city,
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

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <p>Resident with the provided email already exist.</p>
                <p style={{ marginBottom: 16 }}>Add as sub account to
                {' ' + selected.firstname + ' ' + selected.lastname}
                ?</p>
                <Input label="Unit" type="select" options={unit.items.map(el => ({
                    label: el.number,
                    value: el.unit_id
                }))} inputValue={unitID} setInputValue={setUnitID} />
                <div style={{ marginTop: 16 }} />
                {unitID && status && <Input type="button" label="Add as Subaccount" compact
                    onClick={() => {
                        dispatch(addSubaccount(headers, {
                            unit_id: parseInt(unitID),
                            parent_id: selected.id,
                            owner_id: data.id,
                            level: 'sub',
                        }, history));
                        history.goBack();
                    }}
                />}
            </Modal>
            <Form
                showSubmit={!exist || !!selected.id}
                onSubmit={data => {
                    dispatch(createSubaccount(headers, {
                        ...data,
                        birthdate: data.birthdate.replace('T', ' ').replace('Z', ''),
                        status: status,
                        account_status: data.status,
                        parent_id: selected.id,
                        unit_id: parseInt(unitID),
                    }, history))
                }}
                loading={loading}
            >
                <div style={{
                    width: '100%'
                }}>
                    <Input label="Email" type="email" inputValue={email}
                        setInputValue={setEmail} />
                    {exist && <Input label="Check" type="button" compact
                        onClick={() => {
                            post(endpointResident + '/management/resident/check', {
                                email: email
                            }, headers,
                                res => {
                                    setData(res.data.data);
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
                    <Input label="Unit" type="select" options={unit.items.map(el => ({
                        label: el.number,
                        value: el.unit_id,
                    }))} inputValue={unitID} setInputValue={setUnitID} />
                    <Input label="Status" type="select" options={[
                        { value: 'own', label: 'Own' },
                        { value: 'rent', label: 'Rent' },
                    ]} inputValue={status} setInputValue={setStatus} />
                    <SectionSeparator />

                    <Input label="First Name" name="firstname" />
                    <Input label="Last Name" name="lastname" />
                    <Input label="Phone" type="tel" />
                    <Select label="Birth Place" name="birthplace" options={bcities}
                        inputValue={bcity} setInputValue={setBCity}
                        loading={bcloading}
                    />
                    <Input label="Birth Date" name="birthdate" type="date" />
                    <SectionSeparator />
                    <Select label="Nationality" options={countries}
                        inputValue={nat}
                        setInputValue={setNat}
                    />
                    <Input label="Gender" type="select" options={[
                        { value: 'P', label: 'Perempuan' },
                        { value: 'L', label: 'Laki-Laki' },
                    ]} />
                    <Input label="Marital Status" type="select" options={[
                        { value: 'single', label: 'Single' },
                        { value: 'married', label: 'Married' },
                        { value: 'divorce', label: 'Divorced' },
                        { value: 'other', label: 'Other' },
                    ]} />
                    <SectionSeparator />

                    <Input label="Address" type="textarea" />
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

                    <Input label="Account Bank" type="select" options={banks} />
                    <Input label="Account Number" />
                    <Input label="Account Name"
                    />
                </>}
            </Form>
        </div>
    )
}

export default Component;