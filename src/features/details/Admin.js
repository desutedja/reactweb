import React, { } from 'react';
import { useSelector } from 'react-redux';

import Detail from './components/Detail';
import Template from './components/Template';

const details =
{
    'Information': ['id', 'created_on', 'firstname', 'lastname', 'email', 'phone', 'group', 'status'],
};

function AdminDetails() {
    const { selected } = useSelector(state => state.admin);

    return (
        <Template
            title={selected.firstname + ' ' + selected.lastname}
            phone={selected.phone}
            labels={["Details"]}
            contents={[
                <Detail type="Admin" data={selected} labels={details} />,
            ]}
        />
    )
}

export default AdminDetails;
