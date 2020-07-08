import React, { useCallback, useEffect, useState, useMemo } from 'react';
// import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import {
    // getTransactionDetails,
    // setSelected,
    // getTransactionSettlement,
    getTransactionDisbursement } from '../slices/transaction';
import {
    toMoney,
    // toSentenceCase,
    // dateTimeFormatter
} from '../../utils';
import { endpointTransaction, endpointMerchant } from '../../settings';
import { get } from '../slice';

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const [info, setInfo] = useState({});
    const [active, setActive] = useState(0);
    const [
        type,
        // setType
    ] = useState('merchant');

    const [
        merchant,
        // setMerchant
    ] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [
        courier,
        // setCourier
    ] = useState('');
    // const [couriers, setCouriers] = useState([]);

    
    const { loading, refreshToggle, disbursement } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    // let history = useHistory();
    // let { url } = useRouteMatch();

    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Trx Code', accessor: 'trx_code' },
        {
            Header: 'Amount', accessor: row => type === 'merchant' ?
                toMoney(row.total_selling_price) : toMoney(row.assignee_fee)
        },
        {
            Header: 'Disbursement Date', accessor: row => type === 'merchant' ?
                row.disbursement_date ? row.disbursement_date : '-'
                :
                row.courier_disbursement_date ? row.courier_disbursement_date : '-'
        },
    ], [type]);

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary',  res => {
            setInfo(res.data.data);
        }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/list?filter=disbursed',  res => {
            setMerchants(res.data.data.items);
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
            <div style={{
                display: 'flex',
                marginTop: 16,
            }}>
                {merchants.length > 0 && <div className="Container" style={{
                    flexDirection: 'column',
                    marginRight: 16,
                }}>
                    <h5 style={{
                        marginBottom: 16,
                    }}>Select Merchant</h5>
                    {merchants.map((el, index) => <div
                        key={index}
                        className={index === active ? "GroupActive" : "Group"}
                        onClick={() => setActive(index)}
                    >
                        {el.management_name + ' - ' + el.building_name}
                    </div>)}
                </div>}
                <div className="Container" style={{
                    flex: 3,
                    flexDirection: 'column',
                }}>
                    <Table totalItems={disbursement.total_items}
                        columns={columns}
                        data={disbursement.items}
                        loading={loading}
                        pageCount={disbursement.total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransactionDisbursement( pageIndex, pageSize, search,
                                type, merchant, courier));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, ])}
                        filters={[]}
                        actions={[]}
                    />
                </div>
            </div>
        </>
    )
}

export default Component;
