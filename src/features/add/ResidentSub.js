import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import SectionSeparator from '../../components/SectionSeparator';
import { addSubaccount, createSubaccount } from '../slices/resident';
import { endpointResident, banks } from '../../settings';
import countries from '../../countries';
import { get, post } from '../slice';
import Template from './components/Template';

function Component() {
    const [exist, setExist] = useState(true);
    const [modal, setModal] = useState(false);

    const [data, setData] = useState({});
    const [status, setStatus] = useState('');

    const [email, setEmail] = useState('');

    const [unitID, setUnitID] = useState('');

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

    
    const { loading, selected, unit } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointResident + '/geo/province',
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setProvinces(formatted);
            }
        ))
    }, []);

    useEffect(() => {
        setCity("");
        province && dispatch(get(endpointResident + '/geo/province/' + province,
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
    }, [ province]);

    useEffect(() => {
        setDistrict("");
        city && dispatch(get(endpointResident + '/geo/city/' + city,
            
            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
    }, [ city]);

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
    }, []);

    return (
        <Template>
            <Modal isOpen={modal} toggle={() => setModal(false)}>
                <p>Resident with the provided email already exist.</p>
                <p style={{ marginBottom: 16 }}>Add as sub account to
                {' ' + selected.firstname + ' ' + selected.lastname}
                ?</p>
                <Input label="Unit" type="select" options={unit.items.map(el => ({
                    label: el.number,
                    value: el.unit_id
                }))} inputValue={unitID} setInputValue={setUnitID} />
                <div style={{ marginTop: 16 }} />
                {unitID && <Input type="button" label="Add as Subaccount" compact
                    onClick={() => {
                        dispatch(addSubaccount( {
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
                    dispatch(createSubaccount( {
                        ...data,
                        birthdate: data.birthdate.replace('T', ' ').replace('Z', ''),
                        status: unit.items.find(el => el.unit_id === unitID).status,
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
                            dispatch(post(endpointResident + '/management/resident/check', {
                                email: email
                            }, 
                                res => {
                                    setData(res.data.data);
                                    res.data.data.id
                                        ?
                                        setModal(true)
                                        :
                                        setExist(false);
                                },
                            ))
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
                    <Input label="Gender" type="radio" options={[
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
        </Template>
    )
}

export default Component;