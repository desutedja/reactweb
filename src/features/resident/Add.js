import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createResident } from './slice';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const loading = useSelector(state => state.resident.loading);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => dispatch(createResident(headers, data, history))}
                loading={loading}
            >
                <div>
                    <Input label="Email" type="email" />
                    <Input label="Check" type="button" compact />
                </div>
                <SectionSeparator />
                <Input label="First Name" name="firstname" />
                <Input label="Last Name" name="lastname" />
                <Input label="Phone" type="tel" />
            </Form>
        </div>
    )
}

export default Component;