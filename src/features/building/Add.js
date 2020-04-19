import React from 'react';
import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useDispatch, useSelector } from 'react-redux';
import { createBuilding } from './slice';
import { useHistory } from 'react-router-dom';

function Component() {
    const token = useSelector(state => state.auth.user.token);
    const loading = useSelector(state => state.building.loading);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => dispatch(createBuilding(token, data, history))}
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
                <Input label="Select Location" type="button" />
                <Input label="Address" type="textarea" />
                <Input label="Province" type="select" options={[
                    {
                        label: 'Jogja',
                        value: '12'
                    }
                ]} />
                <Input label="City" type="select" options={[
                    {
                        label: 'Bantul',
                        value: '13'
                    }
                ]}/>
                <Input label="District" type="select" options={[
                    {
                        label: 'Srandakan',
                        value: '14'
                    }
                ]}/>
                <Input label="ZIP Code" type="number" name="zipcode" />
            </Form>
        </div>
    )
}

export default Component;