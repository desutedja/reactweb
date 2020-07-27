import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';
import { useHistory, useParams } from 'react-router-dom';
import { get } from '../../slice';
import { endpointMerchant } from '../../../settings';
import { setSelected, deleteMerchant } from '../../slices/merchant';

const info = {
    'Information': [
        "id",
        "name",
        "description",
        "created_on",
        "type",
        "legal",
        "category",
        {label: "building_list", vfmt: v => {
            return v.map((el, i) => el.name + (i === v.length - 1 ? '' : ', '))
        }},
        "address",
        "district_name",
        "city_name",
        "province_name",
        "lat",
        "long",
        "open_at",
        "closed_at",
        "status",
        "status_updated",
    ]
};

const pic = {
    'Information': [
        "pic_name",
        "pic_phone",
        "pic_mail",
    ]
};

const account = {
    'Information': [
        "account_bank",
        "account_no",
        "account_name",
    ]
};

function Component() {
    const [data, setData] = useState({});
    
    let dispatch = useDispatch();
    let history = useHistory();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin?id=' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [id, dispatch])

    return (
        <Template
            image={data.logo || "placeholder"}
            title={data.name}
            phone={data.phone}
            loading={!data.id}
            labels={["Details", "Contact Person", "Bank Account"]}
            contents={[
                <Detail data={data} labels={info}
                    onDelete={() => dispatch(deleteMerchant(data, history))}
                />,
                <Detail data={data} labels={pic} />,
                <Detail data={data} labels={account} />,
            ]}
        />
    )
}

export default Component;
