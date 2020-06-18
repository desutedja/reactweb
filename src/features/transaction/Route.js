import React, { useState, useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import { Badge } from 'reactstrap';
import Details from './Details';
import Settlement from './Settlement';
import Disbursement from './Disbursement';
import { getTransaction, getTransactionDetails, setSelected } from './slice';
import { toMoney, toSentenceCase } from '../../utils';
import { trx_status, trx_statusColor, merchant_types } from '../../settings';
import Filter from '../../components/Filter';

const payment_status = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" }
]

const trx_type = merchant_types;

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    { Header: 'Merchant', accessor: 'merchant_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    // { Header: 'Selling Price', accessor: 'total_selling_price' },
    // { Header: 'Internal Courier Fee', accessor: 'courier_internal_charges' },
    // { Header: 'External Courier Fee', accessor: 'courier_external_charges' },
    // { Header: 'Tax', accessor: 'tax_price' },
    // { Header: 'Discount', accessor: 'discount_price' },
    // { Header: 'Sales Fee', accessor: 'profit_from_sales' },
    // { Header: 'PG Fee', accessor: 'profit_from_pg' },
    // { Header: 'Delivery Fee', accessor: 'profit_from_delivery' },
    //{ Header: 'Total Price', accessor: row => toMoney(row.total_price) },
    { Header: 'Status', accessor: row => 
        <h5><Badge pill color={trx_statusColor[row.status]}>{row.status}</Badge></h5> 
    },
    { Header: 'Payment Amount', accessor: row => toMoney(row.payment_amount) },
    { Header: 'Payment Date', accessor: row => row.payment_date ? row.payment_date : 'Unpaid' },
    //{ Header: 'Settlement Date', accessor: row => row.payment_settled_date ? row.payment_settled_date : '-' },
    //{ Header: 'Merchant Disbursement Date', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
    //{ Header: 'Courier Disbursement Date', accessor: row => row.courier_disbursement_date ? row.courier_disbursement_date : '-' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const [statusPayment, setStatusPayment] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    return (
        <div>
            <Switch>
                <Route exact path={`${path}/list`}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransaction(headers, pageIndex, pageSize, search, status.value, statusPayment.value, type.value));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, status, statusPayment, type])}
                        filters={[
                            {
                                hidex: statusPayment === "",
                                label: <p>{statusPayment ? "Payment: " + statusPayment.label : "Select Payment"}</p>,
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
                                label: <p>{status ? "Status: " + status.label : "Select Status"}</p>,
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
                                label: <p>{type ? "Type: " + type.label : "Select Type"}</p>,
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
                        onClickDetails={row => dispatch(getTransactionDetails(row, headers, history, url))}
                        onClickChat={row => {
                            dispatch(setSelected(row));
                            history.push("/chat");
                        }}
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
