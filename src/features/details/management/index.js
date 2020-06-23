import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/InfoField';
import Template from '../components/Template';

const info = [
    'id', 'created_on', 'name_legal', 'email'
];

const pic = [
    'pic_name', 'pic_phone', 'pic_email'
];

function Component() {
    const { selected } = useSelector(state => state.management);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            website={selected.website}
            phone={selected.phone}
            labels={["Info", "Contact Person"]}
            contents={[
                <InfoField type="Management" data={selected} labels={info} />,
                <InfoField type="Management" data={selected} labels={pic} />,
            ]}
        />
    )
}

export default Component;
