import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get } from '../slice';
import { endpointBilling } from '../../settings';
import moment from 'moment';

import { Card, CardBody } from 'reactstrap';
import Pill from '../../components/Pill';
import Detail from './components/Detail';
import Template from './components/Template';
import Table from '../../components/Table';
import BillingItem from '../../components/cells/BillingItem';
import { toMoney, toSentenceCase, dateTimeFormatter, dateFormatter } from '../../utils';

function Component() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true); 

    let { trx_code } = useParams();
    let dispatch = useDispatch();

    const columns = useMemo(() => ([
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: row => 
        <BillingItem items={[row.name, (row.service_name + " - " + (row.group === 'ipl' ? 'IPL' : 'Non-IPL'))]} 
                unitid={row.resident_unit} id={row.id} /> },
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

    const detailscash = useMemo(() => (
    {
        'Payment': [
            { label: 'trx_code', lfmt: () => "Ref Code", vfmt: (v) => v },
            'paid_by', 
            { label: 'payment_date', lfmt: () => "Payment Date", vfmt: (v) => dateTimeFormatter(v) },
            { label: 'payment_method', lfmt: () => "Via", vfmt: (v) => <Pill color="warning">Payment by Cash</Pill> },
        ],
        'Unit': [
            'unit_number',
            'section_name',
            'building_name',
            'management_name',
        ],
    }), [data]);

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
                label: 'payment_method', lfmt: () => "Payment Method", 
                    vfmt: (v) => toSentenceCase(v) + (data.info?.payment_bank ? "- " + toSentenceCase(data.info?.payment_bank) : "")
            },
        ],
        'Unit': [
            'unit_number',
            'section_name',
            'building_name',
            'management_name',
        ],
        'Disbursement': [
            {label: 'payment_settled', lfmt: () => "Settlement", vfmt: (v) => <Pill color={v ? "success" : "secondary"}>{v ? "Settled" : "Unsettled"}</Pill>},
            {label: 'payment_settled_date', lfmt: () => "Settlement Date", 
                vfmt: (v) => dateTimeFormatter(v) },
            {label: '', lfmt: () => "Disbursement", 
                vfmt: (v) => <Pill color={!data.info?.disbursement_date || data.info?.disbursement_date === '0001-01-01T00:00:00Z' ? "secondary" : "success"}>
                    {!data.info?.disbursement_date || data.info?.disbursement_date === '0001-01-01T00:00:00Z' ? "Undisbursed" : "Disbursed"}</Pill>},
            {label: 'disbursement_date', vfmt: (v) => dateTimeFormatter(v) },
            {label: 'disbursement_destination_bank', lfmt: () => "Destination Bank"},
            {label: 'disbursement_destination_account', lfmt: () => "Destination Account" },
            {label: 'disbursement_transfer_code', lfmt: () => "Transfer Code" },
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
        <Template transparent
                pagetitle="Paid Billing Details"
                title={trx_code}
                loading={loading}
                labels={["Details"]}
                contents={[
                    <>
                    <Card style={{ marginBottom: 20 }}>
                        <CardBody style={{ padding: 30 }}>
                            <div><Detail horizontal data={data.info} 
                                labels={data.info?.payment_method === 'cash' ? detailscash : details} editable={false} /></div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <Table
                                actions={[
                                    <h3>
                                        { data.info?.penalty_fee > 0 ?
                                        <span>
                                            Total: {toMoney(data.items?.reduce((sum, el) => sum + el.total, 0))} + 
                                            {toMoney(data.info?.penalty_amount)} (penalty) = <b style={{ color: '#e12029' }}>
                                                {toMoney(data.info?.selling_price)}</b></span> :
                                        <>Total: <b style={{ color: '#e12029' }}>{toMoney(data.items?.reduce((sum, el) => sum + el.total, 0))}</b></>
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

