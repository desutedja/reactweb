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
import { createBuilding, editBuilding } from './slice';
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
    const { loading, selected } = useSelector(state => state.building);

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
                            lat: lat,
                            lng: lng,
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
                onSubmit={data =>
                    selected ?
                        dispatch(editBuilding(headers, data, history, selected.id))
                        :
                        dispatch(createBuilding(headers, data, history))
                }
                loading={loading}
            >
                <Input label="Building Name" name="name" inputValue={selected.name} />
                <Input label="Legal Name" inputValue={selected.legal_name} />
                <Input label="Code Name" inputValue={selected.code_name} />
                <Input label="Max Units" inputValue={selected.max_units} />
                <Input label="Max Floors" inputValue={selected.max_floors} />
                <Input label="Max Sections" inputValue={selected.max_sections} />
                <Input label="Website" type="url" inputValue={selected.website} />
                <Input label="Logo" type="file" inputValue={selected.logo} />
                <SectionSeparator />
                <Input label="Owner Name" inputValue={selected.owner_name} />
                <Input label="Phone" type="tel" inputValue={selected.phone} />
                <Input label="Email" type="email" inputValue={selected.email} />
                <SectionSeparator />
                <Input label="Select Location" type="button"
                    onClick={() => {
                        setLat(-6.2107863);
                        setLng(106.8137977);
                        setModal(true);
                    }}
                />
                <Input label="Latitude" name="lat" inputValue={lat ? lat : selected.lat} setInputValue={setLat} />
                <Input label="Longitude" name="long" inputValue={lng ? lng : selected.long} setInputValue={setLng} />
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
                <Input label="ZIP Code" type="number" name="zipcode" inputValue={selected.zipcode} />
            </Form>
        </div>
    )
}

export default Component;