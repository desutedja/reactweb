import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { FiMapPin } from 'react-icons/fi';

import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import { createBuilding, editBuilding } from '../slices/building';
import { endpointResident } from '../../settings';
import { get } from '../slice';

import Template from './components/TemplateWithFormik';
import Input from './input';
import { Form } from 'formik';
import { buildingSchema } from './schemas';
import SubmitButton from './components/SubmitButton';

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
    const [modal, setModal] = useState(false);
    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const { selected, loading } = useSelector(state => state.building);

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
            })}
            edit={data => dispatch(editBuilding(data, history, selected.id))}
            add={data => dispatch(createBuilding(data, history))}
            renderChild={props => {
                const { setFieldValue, values, errors } = props;

                return (
                    <Form className="Form">
                        <Modal isOpen={modal} toggle={() => {
                            setModal(false);
                        }} onClick={() => setModal(false)} okLabel={"Select"}>
                            <div style={{ height: '40rem', width: '100%' }}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                                    defaultCenter={{
                                        lat: -6.2107863,
                                        lng: 106.8137977,
                                    }}
                                    zoom={12}
                                    onClick={({ x, y, lat, lng, event }) => {
                                        setFieldValue('lat', lat);
                                        setFieldValue('long', lng);
                                        console.log(lat, lng);
                                    }}
                                    onChange={({ center }) => {
                                        setFieldValue('lat', center.lat);
                                        setFieldValue('long', center.lng);
                                        console.log(center.lat, center.lng);
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)'
                                    }}>
                                        <FiMapPin size={40} color="dodgerblue" />
                                    </div>
                                </GoogleMapReact>
                            </div>
                        </Modal>

                        <Input {...props} label="Building Name" name="name" />
                        <Input {...props} label="Legal Name" />
                        <Input {...props} label="Code Name" />
                        <Input {...props} label="Max Units" />
                        <Input {...props} label="Max Floors" />
                        <Input {...props} label="Max Sections" />
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
