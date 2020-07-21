import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Orders from './contents/Orders';
import { useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { endpointTransaction } from '../../../settings';

const details = {
    'Information': [
        'trx_code',
        'created_on',
        "status",
        'total_qty',
        "rating",
        "rating_comment",
        "delivery_option",
        "payment_settled",
        "payment_settled_date",
        "disbursement_date",
        "disbursement_destination_bank",
        "disbursement_transfer_code",
    ]
};

const resident = {
    'profile': [
        'building_id', 'building_unit_id', 'resident_id', 'resident_name', 'resident_phone',
        'resident_email', 'resident_address',
    ]
};

const merchant = {
    'profile': [
        'merchant_id',
        "type",
    ]
};

const courier = {
    'Information': [
        "courier_provider",
        "courier_internal_id",
        "courier_internal_name",
        "courier_internal_phone",
        "courier_external_id",
        "courier_external_name",
        "courier_external_phone",
        "courier_external_photo",
        "courier_tracking_code",
        "courier_tracking_url",
        "courier_external_status",
    ]
};

const payment = {
    'Information': [
        "total_base_price",
        "total_selling_price",
        "courier_internal_charges",
        "courier_external_charges",
        "discount_price",
        "discount_code",
        "tax_type",
        "tax_price",
        "profit_from_sales",
        "profit_from_pg",
        "profit_from_delivery",
        "total_price",
        "payment",
        "payment_date",
        "payment_method",
        "payment_bank",
        "payment_ref_code",
        "payment_charge",
        "payment_amount",
    ]
};

function Component() {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <Template
            labels={["Details", "Resident", "Merchant", "Courier", "Payment", "Orders"]}
            contents={[
                <Detail data={data} labels={details} editable={false} />,
                <Detail data={data} labels={resident} editable={false} />,
                <Detail data={data} labels={merchant} editable={false} />,
                <Detail data={data} labels={courier} editable={false} />,
                <Detail data={data} labels={payment} editable={false} />,
                <Orders />,
            ]}
        />
    )
}

export default Component;
