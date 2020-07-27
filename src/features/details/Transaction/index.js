import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@material-ui/lab';
import { Rating } from '@material-ui/lab';

import Detail from '../components/Detail';
import Modal from '../../../components/Modal';
import Resident from '../../../components/cells/Resident';
import Staff from '../../../components/cells/Staff';
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

    const [history, setHistory] = useState(false);

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [dispatch, id])

    return (
        <>
        <Modal
            width="750px"
            title="Transaction History"
            disableFooter={true}
            isOpen={history}
            toggle={() => setHistory(false) }
            >
                <Timeline align="alternate">
                  {data.transaction_logs && data.transaction_logs.map((el, index) => 
                      <TimelineItem>
                         <TimelineSeparator> 
                             <TimelineDot/>
                         {index === (data.transaction_logs.length - 1) ||
                             <TimelineConnector/> }
                         </TimelineSeparator>
                         <TimelineContent>
                             <b>{el.status}</b>
                             <div>{dateTimeFormatter(el.created_on)}</div>
                             <div>{el.description}</div>
                         </TimelineContent>
                      </TimelineItem>
                    )}
                </Timeline>
        </Modal>
        <Template transparent
            title={data.trx_code}
            loading={!data.id}
            labels={["Details"]}
            contents={[
                <>
                    <Row>
                        <Column style={{ width: '80%' }}>
                            <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
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
                                                <small>Resident note: {el.remarks_resident}</small>
                                            </div>}
                                            {el.remarks_merchant && <div style={{ padding: '0px 10px' }} >
                                                <small>Merchant note: {el.remarks_merchant}</small>
                                            </div>}
                                            </div>
                                            </>
                                        )}
                                    </div>
                                    {data.items && <ThreeColumn second="Subtotal" third={toMoney(data.items.reduce((sum, el) => sum + el.total_price, 0))} />}
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
                                        <div><a style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }} 
                                                href={"/sa/merchant/"+ data.merchant_id}>{data.merchant_name}</a></div>
                                    </div>
                                </CardFooter>
                            </Card>
                            {data.status === 'completed' && <Card style={{ marginRight: '20px' }}>
                                <CardBody>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <CardTitle><h5>Transaction Rating</h5></CardTitle>
                                    </div>
                                    <Rating name="rating_transaction" value={data.rating} readOnly/>
                                    <div>{data.rating_comment ? data.rating_comment : <i>No rating comment</i>}</div>
                                </CardBody>
                            </Card>}
                        </Column>
                        <Column style={{ width: '20%', display: 'block' }}>
                            <Row>
                                <Card style={{ width: '100%', marginBottom: '20px'}}>
                                    <CardBody>
                                        <CardTitle><h5>Resident</h5></CardTitle>
                                        <Row>
                                            <div style={{  width: '40%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                <Resident id={data.resident_id} data={{photo: data.resident_photo, firstname: data.resident_name,
                                                    lastname: '', email: data.resident_email}} />
                                            </div>
                                            <div style={{  width: '70%', paddingLeft: '10px' }}>
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
                                <Card style={{ marginBottom: '20px', width: "100%" }}>
                                    <CardBody>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle><h5>Status</h5></CardTitle>
                                            <div class="Link" onClick={() => setHistory(true)}>See History</div>
                                        </div>
                                        <Pill>{toSentenceCase(data.status)}</Pill> 
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card style={{ width: '100%' }}>
                                    <CardBody>
                                        <CardTitle><h5>Delivery Information</h5></CardTitle>
                                        <Row>
                                            <div style={{  width: '30%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                <b>Method</b>
                                                <div>{data.courier_provider}</div>
                                            </div>
                                            <div style={{  width: '30%', borderRight: '1px solid rgba(0,0,0,0.125)', paddingLeft: '10px' }}>
                                                <b>External Courier</b>
                                                <div>Type : {data.delivery_type !== "internal" ? data.delivery_type : "-"}</div>
                                                <div>Tracking Code : {data.courier_tracking_code || "-"}</div>
                                                <div>Courier Name : {data.courier_external_name || "-"}</div>
                                                <div>Courier Phone : {data.courier_external_phone || "-"}</div>
                                                <div>Courier Status : {data.courier_external_status || "-"}</div>
                                            </div>
                                            <div style={{  width: '30%', paddingLeft: '10px' }}>
                                                <b>Internal Courier</b>
                                                {data.courier_internal_id ? <Staff id={data.courier_internal_id} data={{firstname: data.courier_internal_name, 
                                                    lastname: '', email: data.courier_internal_email, phone: data.courier_internal_phone,
                                                    staff_role: 'courier' }} /> : <div>-</div>}
                                            </div>
                                        </Row>
                                        
                                    </CardBody>
                                </Card>
                            </Row>
                        </Column>
                    </Row>
                </> 
                    ,
            ]}
        />
        </>
    )
}

export default Component;
