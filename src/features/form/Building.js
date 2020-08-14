import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GoogleMap } from '@react-google-maps/api';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import { FiMapPin } from 'react-icons/fi';

import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import { createBuilding, editBuilding } from '../slices/building';
import { endpointResident } from '../../settings';
import { get } from '../slice';

import Template from './components/TemplateWithFormik';
import Input from './input';
import { Form } from 'formik';
import { buildingSchema } from './services/schemas';
import SubmitButton from './components/SubmitButton';
// import { auth } from 'firebase';

const buildingPayload = {
    name: "",
    legal_name: "",
    code_name: "",
    logo: "",
    website: "",
    owner_name: "",
    phone: "",
    email: "",
    max_sections: "",
    max_floors: "",
    max_units: "",
    lat: "",
    long: "",
    address: "",
    zipcode: "",
    province: "",
    city: "",
    district: "",
    province_label: "",
    city_label: "",
    district_label: "",
}

function Component() {
    const { auth } = useSelector(state => state)
    const [modal, setModal] = useState(false);
    const [districts, setDistricts] = useState([]);

    const [address, setAddress] = useState('');
    const [center, setCenter] = useState(null);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const { selected, loading } = useSelector(state => state.building);
    const { role } = useSelector(state => state.auth);


    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointResident + '/geo/province',

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setProvinces(formatted);
            }
        ))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCity("");
        (province || selected.province) && dispatch(get(endpointResident + '/geo/province/' + (province ? province : selected.province),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [province, selected.province]);

    useEffect(() => {
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city ? city : selected.city),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, selected.city]);

    return (
        <Template
            slice="building"
            payload={selected.id ? {
                ...buildingPayload, ...selected,
                phone: selected.phone.slice(2),
            } : buildingPayload}
            schema={buildingSchema}
            formatValues={values => ({
                ...values,
                phone: '62' + values.phone,
                max_sections: parseInt(values.max_sections, 10),
                max_floors: parseInt(values.max_floors, 10),
                max_units: parseInt(values.max_units, 10),
                zipcode: parseInt(values.zipcode),
                province_name: values.province_label,
                city_name: values.city_label,
                district_name: values.district_label,
                lat: parseFloat(values.lat),
                long: parseFloat(values.long),
            })}
            edit={data => dispatch(editBuilding(data, history, selected.id, auth.role))}
            add={data => dispatch(createBuilding(data, history))}
            renderChild={props => {
                const { setFieldValue, values, errors } = props;

                return (
                    <Form className="Form">
                        <Modal isOpen={modal} toggle={() => {
                            setModal(false);
                        }} onClick={() => setModal(false)} okLabel={"Select"}>
                            <PlacesAutocomplete
                                value={address}
                                onChange={value => setAddress(value)}
                                onSelect={value => {
                                    setAddress(value)
                                    geocodeByAddress(value)
                                        .then(results => getLatLng(results[0]))
                                        .then(latLng => setCenter(latLng))
                                        .catch(error => console.error('Error', error));
                                }}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div className="mb-3"
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <input
                                            {...getInputProps({
                                                placeholder: 'Search Places ...',
                                                className: 'w-100'
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container w-100"
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                zIndex: '1',
                                                borderRadius: '4px',
                                                overflow: 'auto'
                                            }}
                                        >
                                            {loading && <div className="p-3" style={{ backgroundColor: 'white' }}>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = (suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item') + ' p-3';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? {
                                                        backgroundColor: '#fafafa',
                                                        cursor: 'pointer'
                                                    }
                                                    : {
                                                        backgroundColor: '#ffffff',
                                                        cursor: 'pointer'
                                                    };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <div style={{ height: '40rem', width: '100%', position: 'relative' }}>
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    center={center || {
                                        lat: -6.2107863,
                                        lng: 106.8137977,
                                    }}
                                    zoom={12}
                                    onClick={({ latLng }) => {
                                        setCenter({
                                            lat: latLng.lat(),
                                            lng: latLng.lng()
                                        })
                                        setFieldValue('lat', latLng.lat());
                                        setFieldValue('long', latLng.lng());
                                    }}
                                    onUnmount={({ center }) => {
                                        setCenter({
                                            lat: center.lat(),
                                            lng: center.lng()
                                        })
                                        setFieldValue('lat', center.lat());
                                        setFieldValue('long', center.lng());
                                    }}
                                    clickableIcons
                                >
                                </GoogleMap>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                    <FiMapPin size={40} color="dodgerblue"
                                        style={{
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                </div>
                            </div>
                        </Modal>

                        <input type="hidden" value="auk" />
                        <Input {...props} label="Building Name" name="name" disabled={role === 'bm'} />
                        <Input {...props} label="Legal Name" disabled={role === 'bm'} />
                        <Input {...props} label="Site ID" name="code_name" disabled={role === 'bm'} />
                        <Input {...props} label="Max Units" placeholder="Input max units"
                            hint="Maximum unit that can be registered on this Building" />
                        <Input {...props} label="Max Floors" placeholder="Input max floors"
                            hint="Maximum floor that can be registered on each section" />
                        <Input {...props} label="Max Sections"
                            hint="Maximum section (Tower/Wing) that can be registered on this Building" />
                        <Input {...props} label="Website" />
                        <Input {...props} label="Logo" type="file" />
                        <SectionSeparator />
                        <Input {...props} label="Owner Name" />
                        <Input {...props} label="Phone" prefix="+62" />
                        <Input {...props} label="Email" />
                        <SectionSeparator />
                        <button type="button" onClick={() => setModal(true)}>Select Location</button>
                        <Input {...props} label="Latitude" name="lat" />
                        <Input {...props} label="Longitude" name="long" />
                        <Input {...props} label="Address" type="textarea" />
                        <Input {...props} label="Province" options={provinces}
                            onChange={el => setProvince(el.value)}
                        />
                        {values.province && <Input {...props} label="City" options={cities}
                            onChange={el => setCity(el.value)}
                        />}
                        {values.city && <Input {...props} label="District"
                            options={districts} />}
                        <Input {...props} label="ZIP Code" name="zipcode" />
                        <SubmitButton loading={loading} errors={errors} />
                    </Form>
                )
            }
            }
        />
    )
}

export default Component;
