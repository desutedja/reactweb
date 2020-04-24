import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { createManagement } from './slice';
import { useHistory } from 'react-router-dom';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const loading = useSelector(state => state.management.loading);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => dispatch(createManagement(headers, data, history))}
                loading={loading}
            >
                <Input label="Name" />
                <Input label="Legal Name" name="name_legal" />
                <Input label="Phone" type="tel" />
                <Input label="Email" type="email" />
                <Input label="Website" type="url" />
                <Input label="Logo" type="file" />
                <SectionSeparator />
                <Input label="PIC Name" />
                <Input label="PIC Phone" type="tel" />
                <Input label="PIC Email" type="email" />
            </Form>
        </div>
    )
}

export default Component;