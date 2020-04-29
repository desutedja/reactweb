import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { createManagement, editManagement } from './slice';
import { useHistory } from 'react-router-dom';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.management);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editManagement(headers, data, history, selected.id))
                    :
                    dispatch(createManagement(headers, data, history))}
                loading={loading}
            >
                <Input label="Name" inputValue={selected.name} />
                <Input label="Legal Name" name="name_legal" inputValue={selected.name_legal} />
                <Input label="Phone" type="tel" inputValue={selected.phone} />
                <Input label="Email" type="email" inputValue={selected.email} />
                <Input label="Website" type="url" inputValue={selected.website} />
                <SectionSeparator />
                <Input label="Logo" type="file" inputValue={selected.logo} />
                <SectionSeparator />
                <Input label="PIC Name" inputValue={selected.pic_name} />
                <Input label="PIC Phone" type="tel" inputValue={selected.pic_phone} />
                <Input label="PIC Email" type="email" inputValue={selected.pic_email} />
            </Form>
        </div>
    )
}

export default Component;