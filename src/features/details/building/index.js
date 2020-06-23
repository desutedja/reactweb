import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/InfoField';
import Template from '../components/Template';

import Unit from './contents/Unit';
import UnitType from './contents/UnitType';
import Section from './contents/Section';
import Service from './contents/Service';
import Management from './contents/Management';

const info = [
    'id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'phone',
    'email', 'address', 'district_name', 'city_name', 'province_name', 'zipcode',
    'max_units', 'max_floors', 'max_sections'
];

function Component() {
    const { selected } = useSelector(state => state.building);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            website={selected.website}
            labels={["Info", "Unit", "Unit Type", "Section", "Service", "Management"]}
            contents={[
                <InfoField data={selected} labels={info} />,
                <Unit />,
                <UnitType />,
                <Section />,
                <Service />,
                <Management />,
            ]}
        />
    )
}

export default Component;
