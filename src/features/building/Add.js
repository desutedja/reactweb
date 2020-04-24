import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { FiMapPin } from 'react-icons/fi';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { createBuilding } from './slice';
import { endpointResident } from '../../settings';
import { get } from '../../utils';


function Component() {
    const [modal, setModal] = useState(false);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const [district, setDistrict] = useState("");
    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const headers = useSelector(state => state.auth.headers);
    const loading = useSelector(state => state.building.loading);

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
    }, [city, headers]);

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => {
                setLat('');
                setLng('');
                setModal(false);
            }}>
                <div style={{ height: '40rem', width: '60rem' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                        center={{
                            lat: lat ? lat : -6.2107863,
                            lng: lng ? lng : 106.8137977,
                        }}
                        zoom={12}
                        onClick={({ x, y, lat, lng, event }) => {
                            setLat(lat);
                            setLng(lng);
                            console.log(lat, lng);
                        }}
                    >
                        <FiMapPin size={40} />
                    </GoogleMapReact>
                </div>
                <div className="MapForm">
                    <Input label='Latitude' compact inputValue={lat} setInputValue={setLat} />
                    <Input label='Longitude' compact inputValue={lng} setInputValue={setLng} />
                </div>
                <Button label='Select' onClick={() => setModal(false)} />
            </Modal>
            <Form
                onSubmit={data => dispatch(createBuilding(headers, data, history))}
                loading={loading}
            >
                <Input label="Building Name" name="name" />
                <Input label="Legal Name" />
                <Input label="Code Name" />
                <Input label="Max Units" />
                <Input label="Max Floors" />
                <Input label="Max Sections" />
                <Input label="Website" type="url" />
                <Input label="Logo" type="file" />
                <SectionSeparator />
                <Input label="Owner Name" />
                <Input label="Phone" type="tel" />
                <Input label="Email" type="email" />
                <SectionSeparator />
                <Input label="Select Location" type="button"
                    onClick={() => setModal(true)}
                />
                <Input label="Latitude" inputValue={lat} setInputValue={setLat} />
                <Input label="Longitude" inputValue={lng} setInputValue={setLng} />
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
                <Input label="ZIP Code" type="number" name="zipcode" />
            </Form>
        </div>
    )
}

export default Component;