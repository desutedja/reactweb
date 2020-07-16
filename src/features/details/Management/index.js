import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { endpointAdmin } from '../../../settings';
import { setSelected, deleteManagement } from '../../slices/management';
import { get } from '../../slice';

const details =
{
    'Information': ['id', 'created_on', 'name_legal', 'email'],
    'Contact Person': ['pic_name', 'pic_phone', 'pic_email']
};

function Component() {
    let { state } = useLocation();
    const [data, setData] = useState(state ? state : {});
    
    let dispatch = useDispatch();
    let history = useHistory();
    let { id } = useParams();
    useEffect(() => {
        !state && dispatch(get(endpointAdmin + '/management/details/' + id, res => {
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
            labels={["Details"]}
            contents={[
                <Detail type="Management" data={data} labels={details}
                    onDelete={() => dispatch(deleteManagement(data, history))}
                />,
            ]}
        />
    )
}

export default Component;
