import React, { useState, useCallback } from 'react';

import Table from '../../components/Table';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Details from '../details/Transaction';
// import Details from './Details';
import Filter from '../../components/Filter';
import Settlement from '../settlement/Transaction';
import Disbursement from '../disbursement/Transaction';
import { getTransaction, getTransactionDetails, setSelected } from '../slices/transaction';
import { trx_status, trxStatusColor, merchant_types } from '../../settings';
import { toMoney, toSentenceCase, dateTimeFormatterCell } from '../../utils';
import Pill from '../../components/Pill';

const payment_status = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" }
]

const trx_type = merchant_types;

const columns = [
    // { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
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
    
    const { loading, items, total_pages, total_items, refreshToggle } =
        useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const [statusPayment, setStatusPayment] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    return (
        <div>
            <Switch>
                <   Redirect exact from={path} to={`${path}/list`} />
                <Route path={`${path}/list`}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransaction( pageIndex, pageSize, search, status.value, statusPayment.value, type.value));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle,  status, statusPayment, type])}
                        filters={[
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
                        actions={[]}
                        onClickDetails={row => dispatch(getTransactionDetails(row,  history, url))}
                    />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
                <Route path={`${path}/settlement`}>
                    <Settlement />
                </Route>
                <Route path={`${path}/disbursement`}>
                    <Disbursement />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
