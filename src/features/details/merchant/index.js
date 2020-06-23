import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/InfoField';
import Template from '../components/Template';

const info = [
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
];

const pic = [
    "pic_name",
    "pic_phone",
];

const account = [
    "account_bank",
    "account_no",
    "account_name",
];

function Component() {
    const { selected } = useSelector(state => state.merchant);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            phone={selected.phone}
            labels={["Info", "PIC", "Bank Account"]}
            contents={[
                <InfoField data={selected} labels={info} />,
                <InfoField data={selected} labels={pic} />,
                <InfoField data={selected} labels={account} />,
            ]}
        />
    )
}

export default Component;
