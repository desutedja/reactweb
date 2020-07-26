import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Template from '../components/Template';

import { Card, CardHeader, CardFooter, CardTitle, CardBody, CardLink } from 'reactstrap';

import Product from '../../../components/cells/Product';
import Pill from '../../../components/Pill';
import Orders from './contents/Orders';
import { useParams } from 'react-router-dom';
import { get } from '../../slice';
import { setSelected } from '../../slices/transaction';
import { endpointTransaction } from '../../../settings';
import { toMoney, dateTimeFormatter, toSentenceCase } from '../../../utils';

const details = {
    'Information': [
        { label: 'trx_code', lfmt: () => "Transaction Code", vfmt: (v) => v},
        { label: 'created_on', lfmt: () => "Created On", vfmt: (v) => dateTimeFormatter(v)}, 
        /*   'total_qty', */
    ],
    'Status': [
        "status",
    ],
    'Rating': [
        "rating",
        "rating_comment",
    ],
    'Settlement': [
        "payment_settled",
        "payment_settled_date",
        "disbursement_date",
        "disbursement_destination_bank",
        "disbursement_transfer_code",
    ],
    'Delivery': [
        "delivery_option",
    ],
};

const resident = {
    'Profile': [
        'building_id', 'building_unit_id', 'resident_id', 'resident_name', 'resident_phone',
        'resident_email', 'resident_address',
    ]
};

const merchant = {
    'Profile': [
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

const TextField = ({ label, value, align }) => {
    return (
        <Row style={{ padding: '4px', alignItems: 'flex-start' }}>
            <Column flex={3} style={{ textAlign: 'right'}}>
                {label}
            </Column>
            <Column flex={9} style={{ fontWeight: 'normal', textAlign: 'right' }}>
                {value ? value : '-'}
            </Column>
        </Row>
    )
}
const ThreeColumn = ({ first, second, third, noborder=false }) => {
    return (
        <Row style={{ padding: '4px', alignItems: 'center'}}>
            <Column flex={6} style={{ textAlign: 'left' }}>
                {first || " "}
            </Column>
            <Column flex={6} style={{ textAlign: 'right' }}>
                {second}
            </Column>
            <Column flex={6} style={{ textAlign: 'right' }}>
                {third ? third : '-'}
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
            dispatch(setSelected(res.data.data));
        }))
    }, [dispatch, id])

    return (
        <Template
            loading={!data.id}
            labels={["Details", "Resident", "Merchant", "Courier", "Payment", "Orders"]}
            contents={[
                <>
                    <Row>
                        <Column style={{ width: '80%' }}>
                            <Card style={{ marginRight: '20px' }}>
                                <CardBody>
                                    <Row style={{ justifyContent: 'space-between', alignItems: 'bottom' }} >
                                        <CardTitle><h5>Summary</h5> Transaction Code : {data.trx_code}</CardTitle>
                                        <div style={{ display: 'flex' }}>
                                            <Pill color={data.payment === "paid" ? "success": "secondary"}>
                                                {toSentenceCase(data.payment)}
                                            </Pill>
                                        </div>
                                    </Row>
                                    <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.125)', padding: '10px 0px'}} >
                                        {data.items && data.items.map(el =>
                                        <>
                                        <ThreeColumn first={<Product id={el.item_id} 
                                            data={{id: el.item_id, thumbnails: el.item_thumbnails, name: el.item_name, merchant_name: data.merchant_name}}/>} 
                                            second={el.qty + (" item" + (el.qty > 1 ? "s": ""))} 
                                            third={toMoney(el.total_price)} />
                                            <div>
                                            {el.remarks_resident && <div style={{ padding: '0px 10px' }} >
                                                <small>Resident Note: Lorem ipsum dolor sit amet mangana dasdf afdfd dfdfasf a fasdf sdfdsfdsf {el.remarks_resident}</small>
                                            </div>}
                                            {el.remarks_merchant && <div style={{ padding: '0px 10px' }} >
                                                <small>Merchant Note:  Lorem ipsum dolor sit amet mangana dasdf afdfd dfdfasf a fasdf sdfdsfdsf {el.remarks_merchant}</small>
                                            </div>}
                                            </div>
                                            </>
                                        )}
                                    </div>
                                    <ThreeColumn second="Total Selling Price" third={toMoney(data.total_selling_price)} />
                                    {data.discount_code && <ThreeColumn second="Discount Code" third={toMoney(data.discount_code)} />}
                                    <ThreeColumn second={"Tax"  + " (" + data.tax_type + ")"}  third={toMoney(data.tax_price)} />
                                    <ThreeColumn second="Profit From Product" third={toMoney(data.profit_from_sales)} />
                                    <ThreeColumn second="Discount" third={<span style={{ color: "red" }}>{"-" + toMoney(data.discount_price)}</span>} />
                                    <ThreeColumn second="Profit From PG" third={toMoney(data.profit_from_pg)} />
                                    <ThreeColumn second="Internal Courier Charge" third={toMoney(data.profit_from_pg)} />
                                    <ThreeColumn second="External Courier Charge" third={toMoney(data.profit_from_pg)} />
                                    <ThreeColumn second="Profit From Delivery" third={toMoney(data.profit_from_delivery)} />
                                    <ThreeColumn second={<b>Total Profit</b>} 
                                        third={<b>{toMoney(data.profit_from_delivery + data.profit_from_sales + data.profit_from_pg - data.discount_price)}</b>} />

                                </CardBody>
                                <CardFooter>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h5>Merchant</h5>
                                        <div>{data.merchant_id} Warkop Mekdun </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Column>
                        <Column style={{ width: '20%' }}>
                            <Row>
                                <Card style={{ width: '100%', marginBottom: '20px'}}>
                                    <CardBody>
                                        <CardTitle><h5>Resident</h5></CardTitle>
                                        <Row>
                                            <div style={{  width: '40%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                <b>{data.resident_name}</b>
                                                <div>{data.resident_phone}</div>
                                                <div><a href={"mailto:" + data.resident_email}>{data.resident_email}</a></div>
                                            </div>
                                            <div style={{  width: '70%', padding: '10px' }}>
                                                <b>Address</b>
                                                <div>{data.resident_address}</div>
                                                <div>{data.resident_building_unit_id}</div>
                                                <div>{data.resident_building_id}</div>
                                            </div>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card style={{ width: '100%', marginBottom: '20px' }}>
                                    <CardBody>
                                        <CardTitle><h5>Delivery Information</h5></CardTitle>
                                        
                                    </CardBody>
                                </Card>
                            </Row>
                        </Column>
                        {/* <Detail data={data} labels={details} editable={false} /> */}
                    </Row>
                </> 
                    ,
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
