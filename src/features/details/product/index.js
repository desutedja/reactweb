import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/InfoField';
import Template from '../components/Template';

const info = [
    "id",
    "name",
    "item_type",
    "description",
    "length",
    "width",
    "height",
    "weight",
    "measurement_standard",
    "measurement_unit",
    "stock",
    "promoted",
    "promoted_until",
    "base_price",
    "selling_price",
    "admin_fee",
    "pg_fee",
    "delivery_fee",
];

function Component() {
    const { selected } = useSelector(state => state.product);

    return (
        <Template
            image={selected.thumbnails}
            title={selected.name}
            merchant={"Merchant Name"}
            labels={["Info", "Images"]}
            contents={[
                <InfoField data={selected} labels={info} />,
            ]}
        />
    )
}

export default Component;
