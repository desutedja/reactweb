import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import moment from 'moment';

import Filter from '../../components/Filter';
import { getTransaction, downloadTransaction } from '../slices/transaction';
import { trx_status, trxStatusColor, merchant_types } from '../../settings';
import { toMoney, toSentenceCase, dateTimeFormatterCell, isRangeToday } from '../../utils';
import Pill from '../../components/Pill';

import Transaction from '../../components/cells/Transaction';
import Template from './components/Template';
import MyButton from '../../components/Button';
import { FiDownload } from 'react-icons/fi';
import DateRangeFilter from '../../components/DateRangeFilter';

const payment_status = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" }
]

const trx_type = merchant_types;

const columns = [
    {
        Header: 'Trx Code', accessor: row => <Transaction items={[row.trx_code]} trxcode={row.trx_code} />
    },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    { Header: 'Merchant', accessor: 'merchant_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    {
        Header: 'Transaction Date', accessor: row => dateTimeFormatterCell(row.created_on)
    },
    { Header: 'Payment Amount', accessor: row => toMoney(row.payment_amount) },
    {
        Header: 'Payment Date', accessor: row => row.payment_date ?
            dateTimeFormatterCell(row.payment_date) : 'Unpaid'
    },
    {
        Header: 'Status', accessor: row => row.status ?
            <Pill color={trxStatusColor[row.status]}>
                {toSentenceCase(row.status)}
            </Pill> : "-"
    },
]

function Component() {
    let dispatch = useDispatch();

    const today = moment().format('yyyy-MM-DD');

    const [statusPayment, setStatusPayment] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const [trxStart, setTrxStart] = useState(moment().format('yyyy-MM-DD'));
    const [trxEnd, setTrxEnd] = useState(moment().format('yyyy-MM-DD'));

    return (
        <Template
            columns={columns}
            slice="transaction"
            getAction={getTransaction}
            filterVars={[status.value, statusPayment.value, type.value, trxStart, trxEnd]}
            filters={[
                {
                    hidex: isRangeToday(trxStart, trxEnd),
                    label: "Transaction Date: ",
                    delete: () => { setTrxStart(today); setTrxEnd(today) },
                    value: isRangeToday(trxStart, trxEnd) ? 'Today' :
                    moment(trxStart).format('DD-MM-yyyy') + ' - '
                    + moment(trxEnd).format('DD-MM-yyyy'),
                    component: (toggleModal) =>
                        <DateRangeFilter
                            startDate={trxStart}
                            endDate={trxEnd}
                            onApply={(start, end) => {
                                setTrxStart(start);
                                setTrxEnd(end);
                                toggleModal();
                            }} />
                },
                {
                    hidex: statusPayment === "",
                    label: <p>{statusPayment ? "Payment: " + statusPayment.label : "Payment: All"}</p>,
                    delete: () => { setStatusPayment(""); },
                    component: (toggleModal) =>
                        <>
                            <Filter
                                data={payment_status}
                                onClick={(el) => {
                                    setStatusPayment(el);
                                    toggleModal(false);
                                }}
                                onClickAll={() => {
                                    setStatusPayment("");
                                    toggleModal(false);
                                }}
                            />
                        </>
                },
                {
                    hidex: status === "",
                    label: <p>{status ? "Status: " + status.label : "Status: All"}</p>,
                    delete: () => { setStatus(""); },
                    component: (toggleModal) =>
                        <>
                            <Filter
                                data={trx_status}
                                onClick={(el) => {
                                    setStatus(el);
                                    toggleModal(false);
                                }}
                                onClickAll={() => {
                                    setStatus("");
                                    toggleModal(false);
                                }}
                            />
                        </>
                },
                {
                    hidex: type === "",
                    label: <p>{type ? "Type: " + type.label : "Type: All"}</p>,
                    delete: () => { setType(""); },
                    component: (toggleModal) =>
                        <>
                            <Filter
                                data={trx_type}
                                onClick={(el) => {
                                    setType(el);
                                    toggleModal(false);
                                }}
                                onClickAll={() => {
                                    setType("");
                                    toggleModal(false);
                                }}
                            />
                        </>
                },
            ]}
            actions={[
                <MyButton label="Download .csv" icon={<FiDownload />}
                    onClick={() => {
                        dispatch(downloadTransaction(status, statusPayment, type))
                    }}
                />
            ]}
        />
    )
}

export default Component;
