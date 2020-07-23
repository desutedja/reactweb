import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Template from '../components/Template';

import Orders from './contents/Orders';
import { useParams } from 'react-router-dom';
import { get } from '../../slice';
import { endpointTransaction } from '../../../settings';
import { toMoney } from '../../../utils';

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

const TextField = ({ label, value }) => {
    return (
        <Row style={{ padding: '4px', alignItems: 'flex-start' }}>
            <Column flex={3} style={{ fontWeight: 'bold', textAlign: 'left' }}>
                {label}
            </Column>
            <Column flex={9} style={{ fontWeight: 'normal', }}>
                {value ? value : '-'}
            </Column>
        </Row>
    )
}

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
            loading={!data.id}
            labels={["Details", "Resident", "Merchant", "Courier", "Payment", "Orders"]}
            contents={[
                <Detail data={data} labels={details} editable={false} />,
                <Detail data={data} labels={resident} editable={false} />,
                <Detail data={data} labels={merchant} editable={false} />,
                <Detail data={data} labels={courier} editable={false} />,
                <>
                    <TextField label={"Base Price"} value={toMoney(data.total_base_price)} />
                    <TextField label={"Selling Price"} value={toMoney(data.total_selling_price)} />

                    <TextField label={"Internal Courier Charge"} value={toMoney(data.courier_internal_charges)} />
                    <TextField label={"External Courier Charge"} value={toMoney(data.courier_external_charges)} />

                    <TextField label={"Discount"} value={toMoney(data.discount_price)} />
                    <TextField label={"Discount Code"} value={data.discount_code} />

                    <TextField label={"Tax Type"} value={data.tax_type} />
                    <TextField label={"Tax"} value={toMoney(data.tax_price)} />

                    <TextField label={"Profit from Sale"} value={toMoney(data.profit_from_sales)} />
                    <TextField label={"Profit from PG"} value={toMoney(data.profit_from_pg)} />
                    <TextField label={"Profit from Delivery"} value={toMoney(data.profit_from_delivery)} />

                    <TextField label={"Total Price"} value={toMoney(data.total_price)} />

                    <TextField label={"Payment Status"} value={data.payment} />
                    {data.payment === 'paid' && <>
                        <TextField label={"Payment Date"} value={data.payment_date} />
                        <TextField label={"Payment Method"} value={data.payment_method} />
                        <TextField label={"Payment Bank"} value={data.payment_bank} />
                        <TextField label={"Payment Refcode"} value={data.payment_ref_code} />

                        <TextField label={"Convenience Fee"} value={toMoney(data.payment_charge)} />
                        <TextField label={"Payment Amount"} value={toMoney(data.payment_amount)} />
                    </>}
                </>,
                <Orders />,
            ]}
        />
    )
}

export default Component;
