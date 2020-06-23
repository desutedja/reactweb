import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/Detail';
import Template from '../components/Template';

const info = {
    'Information': [
        "id",
        "name",
        "description",
        "created_on",
        "type",
        "legal",
        "category",
        "in_building",
        "address",
        "district",
        "city",
        "province",
        "lat",
        "long",
        "open_at",
        "closed_at",
        "status",
        "status_updated",
        "promoted",
        "promoted_until",
    ]
};

const pic = {
    'Information': [
        "pic_name",
        "pic_phone",
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
    const { selected } = useSelector(state => state.merchant);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            phone={selected.phone}
            labels={["Details", "PIC", "Bank Account"]}
            contents={[
                <InfoField data={selected} labels={info} />,
                <InfoField data={selected} labels={pic} />,
                <InfoField data={selected} labels={account} />,
            ]}
        />
    )
}

export default Component;
