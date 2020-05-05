import React, { useEffect, useState } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editStaff, createStaff } from './slice';
import { endpointResident } from '../../settings';
import { get } from '../../utils';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.staff);

    const [district, setDistrict] = useState("");
    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

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
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editStaff(headers, data, history, selected.id))
                    :
                    dispatch(createStaff(headers, data, history))}
                loading={loading}
            >
                <Input label="Firstname" />
                <Input label="Lastname" />
                <Input label="Email" type="email" />
                <Input label="Phone" type="tel" />
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

                <Input label="Select Building" type="button" />
                <Input label="Select Management" type="button" />
                <Input label="Is Internal?" type="select"
                    name="on_centratama"
                    options={[
                        { value: 1, label: 'Yes' },
                        { value: 0, label: 'No' },
                    ]} />
                <Input label="Staff ID" />
                <Input label="Staff Role" type="select" options={[
                    { value: 'gm_bm', label: 'GM BM' },
                    { value: 'pic_bm', label: 'PIC BM' },
                    { value: 'technician', label: 'Technician' },
                    { value: 'courier', label: 'Courier' },
                    { value: 'security', label: 'Security' },
                ]} />
                <Input label="Status" type="select" options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ]} />
                <SectionSeparator />

                <Input label="Address" type="textarea" />
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
            </Form>
        </div>
    )
}

export default Component;