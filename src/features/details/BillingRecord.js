import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { post, get } from '../slice';
import { endpointBilling } from '../../settings';
import moment from 'moment';

import { Card, CardBody } from 'reactstrap';
import Pill from '../../components/Pill';
import Detail from './components/Detail';
import Template from './components/Template';
import Table from '../../components/Table';
import { toMoney, toSentenceCase, dateTimeFormatter, dateFormatter } from '../../utils';

function Component() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState('');
    const [pageCount, setPageCount] = useState('');

    const { unit } = useSelector(state => state.billing);
    let { trx_code } = useParams();
    let dispatch = useDispatch();

    const columns = useMemo(() => ([
        { Header: 'Name', accessor: 'name' },
        { Header: 'Group', accessor: 'group' },
        { Header: 'Usage (Recent - Previous)', 
            accessor: row => <>{row.recent_usage - row.previous_usage} ({row.recent_usage} - {row.previous_usage}) {row.denom_unit}</>},
        { Header: 'Due Date', accessor: row => 
        <div style={{ display: 'block' }}><div>{dateFormatter(row.due_date)}</div> <b style={{ color: "red" }}>
                {moment.utc(data.payment_date).isAfter(moment.utc(row.due_date)) ? "(Payment Overdue)" : ""}</b></div>},
        { Header: 'Price', accessor: row => toMoney(row.subtotal) },
        { Header: 'Tax', accessor: row => row.tax === "percentage" ? row.tax_value + "%" : toMoney(row.tax_amount) },
        { Header: 'Total', accessor: row => toMoney(row.total) },
    ]),[data]);

    const details = useMemo(() => (
    {
        'Payment': [
            {label: 'trx_code', lfmt: () => "Ref Code", vfmt: (v) => v},
            'paid_by', 
            {label: 'payment_date', lfmt: () => "Payment Date", vfmt: (v) => 
                dateTimeFormatter(v)
            },
            {label: 'payment_method', lfmt: () => "Via", vfmt: (v) => 
                v === 'cash' ? <Pill color="warning">Payment by Cash</Pill> : <Pill color="success">Payment via apps</Pill>
            },
            {disabled: data.info?.payment_method === 'cash',
                label: 'payment_bank', lfmt: () => "Payment Method", vfmt: (v) => toSentenceCase(v) 
            },
        ],
        'Unit': [
            'unit_number',
            'section_name',
            'building_name',
            'management_name',
        ],
    }), [data]);

    useEffect(() => {
        setLoading(true);
        dispatch(get(endpointBilling + '/management/billing/trx?trx=' +
            trx_code, res => {
                setData(res.data.data);
                setLoading(false);
            }))
    }, [dispatch, trx_code])

        return  (
        <>
        <Template
                title={trx_code}
                loading={loading}
                labels={["Details"]}
                contents={[
                    <>
                    <Card style={{ marginBottom: 20 }}>
                        <CardBody style={{ padding: 30 }}>
                            <div><Detail horizontal data={data.info} labels={details} editable={false} /></div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <Table
                                actions={[
                                    <h3>
                                        { data.info?.penalty_fee > 0 ?
                                        <span>
                                            Total: {toMoney(data.items?.reduce((sum, el) => sum + el.total, 0))} +  {toMoney(data.info?.penalty_fee)} (penalty) = <b style={{ color: 'blue' }}>{toMoney(data.info?.selling_price)}</b></span> :
                                        <>Total: <b style={{ color: 'blue' }}>{toMoney(data.items?.reduce((sum, el) => sum + el.total, 0))}</b></>
                                    }

                                    </h3>
                                ]}
                                columns={columns}
                                data={data.items}
                                totalItems={data.total_items}
                            />
                        </CardBody>
                    </Card>
                    </>
                    ,
                ]}
                    />
            </>);
}

export default Component;

