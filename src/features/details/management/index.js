import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/Detail';
import Template from '../components/Template';

const labels =
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
                <InfoField type="Management" data={selected} labels={labels} />,
            ]}
        />
    )
}

export default Component;
