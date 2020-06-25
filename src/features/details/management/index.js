import React, { } from 'react';
import { useSelector } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

const details =
{
    'Information': ['id', 'created_on', 'name_legal', 'email'],
    'Contact Person': ['pic_name', 'pic_phone', 'pic_email']
};

function Component() {
    const { selected } = useSelector(state => state.management);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            website={selected.website}
            phone={selected.phone}
            labels={["Details"]}
            contents={[
                <Detail type="Management" data={selected} labels={details} />,
            ]}
        />
    )
}

export default Component;
