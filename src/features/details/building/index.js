import React, { } from 'react';
import { useSelector } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Unit from './contents/Unit';
import UnitType from './contents/UnitType';
import Section from './contents/Section';
import Service from './contents/Service';
import Management from './contents/Management';

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'phone', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}

function Component() {
    const { selected } = useSelector(state => state.building);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            website={selected.website}
            labels={["Details", "Unit", "Unit Type", "Section", "Service", "Management"]}
            contents={[
                <Detail data={selected} labels={labels} />,
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
