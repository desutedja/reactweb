import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editStaff, createStaff } from './slice';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.staff);

    let dispatch = useDispatch();
    let history = useHistory();

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
                <Input label="Email" />
                <Input label="Phone" />
                <Input label="Gender" />
                <Input label="Marital Status" />
                <SectionSeparator />

                <Input label="Select Building" />
                <Input label="Select Management" />
                <Input label="Is Internal?" />
                <Input label="Staff ID" />
                <Input label="Staff Role" />
                <Input label="Status" />
                <SectionSeparator />

                <Input label="Address" />
                <Input label="Province" />
                <Input label="City" />
                <Input label="District" />
                <SectionSeparator />

                <Input label="Account Bank" />
                <Input label="Account Name" />
                <Input label="Account Number" />
            </Form>
        </div>
    )
}

export default Component;