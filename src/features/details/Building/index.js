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
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { setSelected, deleteBuilding } from '../../slices/building';

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}

function Component() {
    let { state } = useLocation();
    const [data, setData] = useState(state ? state : {});
    
    let dispatch = useDispatch();
    let history = useHistory();
    let { id } = useParams();
    useEffect(() => {
        !state && dispatch(get(endpointAdmin + '/building/details/' + id, res => {
            setData(res.data.data);
            setSelected(res.data.data);
        }))
    }, [id, state, dispatch])

    return (
        <Template
            image={data.logo}
            title={data.name}
            website={data.website}
            phone={data.phone}
            labels={["Details", "Section", "Unit Type", "Unit", "Service", "Management", "Module"]}
            contents={[
                <Detail data={data} labels={labels}
                    onDelete={() => dispatch(deleteBuilding(data, history))}
                />,
                <Section />,
                <UnitType />,
                <Unit />,
                <Service />,
                <Management />,
                <Module />
            ]}
        />
    )
}

export default Component;
