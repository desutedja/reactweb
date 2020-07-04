import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import { getTransactionDetails, getTransactionSettlement } from '../slices/transaction';
import { toMoney, dateTimeFormatter } from '../../utils';
import { endpointTransaction } from '../../settings';
import { get } from '../slice';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Amount', accessor: row => toMoney(row.total_price) },
    {
        Header: 'Settlement Date', accessor: row => row.payment_settled_date ?
            dateTimeFormatter(row.payment_settled_date) : '-'
    },
];

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const [info, setInfo] = useState({});

    
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary',  res => {
            setInfo(res.data.data);
        }));
    }, [dispatch]);

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
                        }}>Merchant Disbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_merchant_disbursed_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Merchant Undisbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_merchant_undisbursed_transaction_amount}
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
                        }}>Courier Disbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_courier_disbursed_transaction_amount}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>Courier Undisbursed Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.total_courier_undisbursed_transaction_amount}
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
                    dispatch(getTransactionSettlement( pageIndex, pageSize, search));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle, ])}
                filters={[]}
                actions={[]}
                onClickDetails={row => dispatch(getTransactionDetails(row,  history, url))}
            />
        </>
    )
}

export default Component;
