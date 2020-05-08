import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident, editResident } from './slice';
import { post, get } from '../../utils';
import { endpointResident } from '../../settings';
import { FiSearch } from 'react-icons/fi';

function Component() {
    const [exist, setExist] = useState(false);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);

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
    const [bcitiesSearched, setBCitiesSearched] = useState([]);
    const [bcloading, setBCLoading] = useState(true);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.resident);

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
        if (!search) {
            setBCLoading(true);
            get(endpointResident + '/geo/city',
                headers,
                res => {
                    let formatted = res.data.data.map(el => ({ label: el.name, value: el.name }));
                    setBCities(formatted);
                    setBCitiesSearched(formatted);
                    setBCLoading(false);
                }
            )
        }
    }, [headers, search]);

    useEffect(() => {
        if (search.length >= 3) {
            let result = bcities.filter(el => el.value.toLowerCase().includes(search.toLowerCase()));

            setBCitiesSearched(result);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <p>Resident with the provided email already exist.</p>
                <p style={{ marginBottom: 16 }}>Add as sub account to another resident?</p>
                <Input label="Search Resident" icon={<FiSearch />} compact
                    inputValue={searchRes} setInputValue={setSearchRes}
                />
            </Modal>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editResident(headers, data, history, selected.id))
                    :
                    dispatch(createResident(headers, data, history))}
                loading={loading}
            >
                <div>
                    <Input label="Email" type="email" inputValue={email} setInputValue={setEmail} />
                    <Input label="Check" type="button" compact
                        onClick={() => {
                            post(endpointResident + '/management/resident/check', {
                                email: email
                            }, headers,
                                res => {
                                    res.data.data.id ?
                                        setModal(true)
                                        :
                                        setExist(false);
                                },
                            )
                        }}
                    />
                    <SectionSeparator />
                </div>
                {!exist && <>
                    <SectionSeparator />
                    <Input label="First Name" name="firstname" />
                    <Input label="Last Name" name="lastname" />
                    <Input label="Phone" type="tel" />
                    <Select label="Birth Place" type="select" options={bcitiesSearched}
                        search={search} setSearch={setSearch}
                        inputValue={bcity ? bcity : selected.bcity} setInputValue={setBCity}
                        loading={bcloading}
                    />
                    <Input label="Birth Date" type="date" />
                    <SectionSeparator />

                    <Input label="Nationality" inputValue={selected.nationality} />
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

                    <Input label="Account Bank" inputValue={selected.account_bank} />
                    <Input label="Account Number" inputValue={selected.account_no} />
                    <Input label="Account Name"
                        inputValue={selected.account_name} />
                </>}
            </Form>
        </div>
    )
}

export default Component;