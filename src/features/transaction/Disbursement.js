import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import { getTransactionDetails, setSelected, getTransactionSettlement } from './slice';
import { toMoney, toSentenceCase, get, dateTimeFormatter } from '../../utils';
import { endpointTransaction } from '../../settings';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    // { Header: 'Selling Price', accessor: 'total_selling_price' },
    // { Header: 'Internal Courier Fee', accessor: 'courier_internal_charges' },
    // { Header: 'External Courier Fee', accessor: 'courier_external_charges' },
    // { Header: 'Tax', accessor: 'tax_price' },
    // { Header: 'Discount', accessor: 'discount_price' },
    // { Header: 'Sales Fee', accessor: 'profit_from_sales' },
    // { Header: 'PG Fee', accessor: 'profit_from_pg' },
    // { Header: 'Delivery Fee', accessor: 'profit_from_delivery' },
    { Header: 'Total Price', accessor: row => toMoney(row.total_price) },
    {
        Header: 'Payment Date', accessor: row => row.payment_date ?
            dateTimeFormatter(row.payment_date) : 'Unpaid'
    },
    {
        Header: 'Settlement Date', accessor: row => row.payment_settled_date ?
            dateTimeFormatter(row.payment_settled_date) : '-'
    },
    //{ Header: 'Merchant Disbursement Date', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
    //{ Header: 'Courier Disbursement Date', accessor: row => row.courier_disbursement_date ? row.courier_disbursement_date : '-' },
];

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const [info, setInfo] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        get(endpointTransaction + '/admin/transaction/summary', headers, res => {
            setInfo(res.data.data);
        });
    }, [headers]);

    return (
        <>
            <div className="Container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Settled Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_settled_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Unsettled Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_unsettled_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Disbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_disbursed_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Undisbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_undisbursed_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
            </div>
            <Table totalItems={total_items}
                columns={columns}
                data={items}
                loading={loading}
                pageCount={total_pages}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getTransactionSettlement(headers, pageIndex, pageSize, search));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle, headers])}
                filters={[]}
                actions={[]}
                onClickDetails={row => dispatch(getTransactionDetails(row, headers, history, url))}
                onClickChat={row => {
                    dispatch(setSelected(row));
                    history.push("/chat");
                }}
            />
        </>
    )
}

export default Component;
