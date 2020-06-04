import React from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Form
                onSubmit={data => 
                    {}}
                    // selected.id ?
                    // dispatch(editName(headers, data, history, selected.id))
                    // :
                    // dispatch(createName(headers, data, history))}
                loading={loading}
            >
                <Input label="Title" />
                <Input label="Topic" />
                <Input label="Building" hidden />
                <Input label="Select Building" icon={<FiChevronRight />}  />
                <Input label="Consumer Role" />
                <Input label="Consumer ID" />
                <Input label="Image" />
                <Input label="Description" />
                <SectionSeparator />
            </Form>
        </div>
    )
}

export default Component;