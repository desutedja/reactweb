import React, { useEffect, useState } from 'react';
import {
    useDispatch
} from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Unit from './contents/Unit';
import UnitType from './contents/UnitType';
import Section from './contents/Section';
import Service from './contents/Service';
import Management from './contents/Management';
import Module from './contents/Module';
import { endpointAdmin } from '../../../settings';
import { useLocation, useParams } from 'react-router-dom';
import { get } from '../../slice';

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}

function Component() {
    const [data, setData] = useState({});
    
    let dispatch = useDispatch();
    let { state } = useLocation();
    let { id } = useParams();
    useEffect(() => {
        !state && dispatch(get(endpointAdmin + '/building/details/' + id, res => {
            setData(res.data.data);
        }))
    }, [id, state, dispatch])

    // const { selected } = useSelector(state => state.building);

    return (
        <Template
            image={state ? state.logo : data.logo}
            title={state ? state.name : data.name}
            website={state ? state.website : data.website}
            phone={state ? state.phone : data.phone}
            labels={["Details", "Unit", "Unit Type", "Section", "Service", "Management", "Module"]}
            contents={[
                <Detail data={state ? state : data} labels={labels} />,
                <Unit />,
                <UnitType />,
                <Section />,
                <Service />,
                <Management />,
                <Module />
            ]}
        />
    )
}

export default Component;
