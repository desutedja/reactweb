import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.name);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editName(headers, data, history, selected.id))
                    :
                    dispatch(createName(headers, data, history))}
                loading={loading}
            >
                <Input label="Name" />
                <SectionSeparator />
            </Form>
        </div>
    )
}

export default Component;