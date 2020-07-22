import React, { useCallback, useEffect, useState, useMemo } from 'react';
// import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import ClinkLoader from '../../components/ClinkLoader';
import { FiCheck, FiSearch, FiDownload } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";
import Tab from '../../components/Tab';

import Table from '../../components/Table';
import { getTransactionDisbursement, refresh, downloadTransactionDisbursement } from '../slices/transaction';
import {
    toMoney
} from '../../utils';
import { trxStatusColor, endpointManagement } from '../../settings';
import { toSentenceCase, dateTimeFormatterCell } from '../../utils';
import Pill from '../../components/Pill';
import { endpointTransaction, endpointMerchant } from '../../settings';
import { get, post } from '../slice';
import MyButton from '../../components/Button';

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const [info, setInfo] = useState({});
    const [active, setActive] = useState(0);
    const [selected, setSelected] = useState([]);
    const [limit, setLimit] = useState(5);
    const [loadingMerchant, setLoadingMerchant] = useState(false)
    const [loadingCourier, setLoadingCourier] = useState(false)
    const [transferCode, setTransferCode] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [
        type,
        setType
    ] = useState('merchant');
    const [disburseModal, setDisburseModal] = useState(false);
    const [
        merchant,
        setMerchant
    ] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [
        courier,
        setCourier
    ] = useState('');
    const [couriers, setCouriers] = useState([]);


    const { loading, refreshToggle, disbursement } = useSelector(state => state.transaction);

    let dispatch = useDispatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return type === 'merchant' ? sum + el.total_selling_price : sum + el.assignee_fee;
        }, 0)
    }

    const columns = useMemo(() => {
        if (type === 'merchant') return [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Trx Code', accessor: 'trx_code' },
            {
                Header: 'Amount', accessor: row => type === 'merchant' ?
                    toMoney(row.total_selling_price) : toMoney(row.assignee_fee)
            }, {
                Header: 'Disbursement Status', accessor: row => {
                    // console.log(row)
                    return (
                        row.disbursement_date !== null ?
                            <Pill color={trxStatusColor['paid']}>
                                {toSentenceCase('disbursed')}
                            </Pill> : <Pill color={trxStatusColor['requested']}>
                                {toSentenceCase('undisbursed')}
                            </Pill>
                    )
                }
            },
            {
                Header: 'Disbursement Date', accessor: row => type === 'merchant' ?
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
                    :
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
            },
        ]
        else return [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Ref Code', accessor: 'ref_code' },
            {
                Header: 'Assignee Fee', accessor: row => toMoney(row.assignee_fee)
            },
            {
                Header: 'Completed On', accessor: row => dateTimeFormatterCell(row.completed_on)
            },
            {
                Header: 'Disbursement Status', accessor: row => row.disbursement_date !== null ?
                    <Pill color={trxStatusColor['paid']}>
                        {toSentenceCase('disbursed')}
                    </Pill> : <Pill color={trxStatusColor['requested']}>
                        {toSentenceCase('undisbursed')}
                    </Pill>
            },
            {
                Header: 'Disbursement Date', accessor: row => type === 'merchant' ?
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
                    :
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
            },
        ]
    }, [type]);

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary', res => {
            setInfo(res.data.data);
        }));
    }, [dispatch]);

    useEffect(() => {
        setLimit(5);
    }, [type])

    useEffect(() => {
        setTimeout(() => {

            setLoadingMerchant(true);
            setLoadingCourier(true);

            type === 'merchant' && dispatch(get(endpointMerchant + '/admin/list?filter=&limit='
            + limit + '&search=' + searchValue, res => {
                setMerchants(res.data.data.items);
                setMerchant(res.data.data.items[active].id);
                setLoadingMerchant(false);
            }, err => {
                console.log('FAILED GET LIST DISBURSEMENT MERCHANT:', err)
                setLoadingMerchant(false);
            }));

            type === 'courier' && dispatch(get(endpointManagement + '/admin/staff/list?filter=&staff_role=courier&limit=' + limit + '&search=' + searchValue, res => {
                setCouriers(res.data.data.items);
                setCourier(res.data.data.items[active].id);
                setLoadingCourier(false);
            }, err => {
                console.log('FAILED GET LIST DISBURSEMENT COURIER:', err)
                setLoadingCourier(false);
            }));
            
        }, searchValue ? 1000 : 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, searchValue, limit]);


    return (
        <>
            <Modal
                isOpen={disburseModal} toggle={() => setDisburseModal(!disburseModal)}
                title="Disbursement Selection"
                okLabel="Flag as Disbursed"
                disabledOk={transferCode.length === 0}
                onClick={() => {
                    if (!transferCode) return;
                    const currentDate = new Date().toISOString()
                    const trx_codes = selected.map(el => el.trx_code)
                    const ref_codes = selected.map(el => el.ref_code)
                    const dataDisburse = type === 'merchant' ? {
                        trx_codes,
                        merchant_id: Number(merchant),
                        amount: getSum(selected),
                        disbursed_on: currentDate,
                        disbursed_code: transferCode
                    } : {
                            trx_codes: ref_codes,
                            courier_id: Number(courier),
                            amount: getSum(selected),
                            disbursed_on: currentDate,
                            disbursed_code: transferCode
                    }

                    if (type === 'merchant') dispatch(post(endpointTransaction + '/admin/disbursement/merchant/create', dataDisburse, res => {
                        setDisburseModal(false);
                        dispatch(refresh());
                    }))
                    if (type === 'courier') dispatch(post(endpointTransaction + '/admin/disbursement/courier/create', dataDisburse, res => {
                        setDisburseModal(false);
                        dispatch(refresh());
                    }));
                }}
            >
                <div style={{
                    display: 'flex',
                    marginBottom: 32,
                    position: 'relative'
                }}>
                    <Input compact
                        type="text"
                        label="Transfer Code"
                        inputValue={transferCode}
                        setInputValue={setTransferCode}
                        noMargin={true}
                    />
                </div>
                <div style={{
                    minHeight: 300,
                }}>
                    {type === 'merchant' && selected.map(el => {
                        return (
                            <div key={el.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: 12,
                                marginBottom: 8,
                                borderRadius: 6,
                                border: '1px solid rgba(0, 0, 0, .3',
                                backgroundColor: 'white'
                            }}>
                                <div>
                                    <div>Trx Code</div>
                                    {el.trx_code}
                                </div>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>
                                    {toMoney(el.total_selling_price)}
                                </div>
                            </div>
                        )
                    }
                    )}
                    {type === 'courier' && selected.map(el => {
                        return (
                            <div key={el.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: 12,
                                marginBottom: 8,
                                borderRadius: 6,
                                backgroundColor: 'rgb(215, 215, 215)',
                            }}>
                                <div>
                                    <div>Ref Code</div>
                                    {el.ref_code}
                                </div>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>
                                    {toMoney(el.assignee_fee)}
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
                <div style={{
                    marginTop: 16,
                }}>
                    <h5>Total {toMoney(getSum(selected))}</h5>
                </div>
            </Modal>
            <div className="Container" style={{
                flex: 'none',
                height: 120,
            }}>
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
                <div className="Container" style={{
                    flexDirection: 'column',
                    marginRight: 16,
                }}>
                    <Tab
                        labels={["Merchant", "Courier"]}
                        setTab={setType}
                        tabActive={setActive}
                        contents={[
                            <>
                                <h5 style={{
                                    marginBottom: 16,
                                }}>Select Merchant</h5>
                                <InputSearch value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                                {loadingMerchant && <div className="w-100 py-5 d-flex justify-content-center">
                                    <ClinkLoader />
                                </div>}
                                {!loadingMerchant && merchants
                                    .map((el, index) => <div
                                        key={index}
                                        className={index === active ? "GroupActive" : "Group"}
                                        onClick={() => {
                                            setMerchant(el.id.toString());
                                            setCourier('');
                                            setActive(index)
                                        }}
                                    >
                                        {el.name}
                                    </div>)}
                                {!loadingMerchant && merchants.length === 0 && (
                                    <div className="w-100 text-center">No Merchant found</div>
                                )}
                                {!loadingMerchant && merchants.length !== 0 && merchants.length >= limit && (
                                    <div className="btn w-100 text-primary"
                                        onClick={() => setLimit(limit + 10)}
                                    >load 10 more</div>
                                )}
                            </>,
                            <>
                                <h5 style={{
                                    marginBottom: 16,
                                }}>Select Courier</h5>
                                <InputSearch value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                                {loadingCourier && <div className="w-100 py-5 d-flex justify-content-center">
                                    <ClinkLoader />
                                </div>}
                                {!loadingCourier && couriers
                                    .map((el, index) => <div
                                        key={index}
                                        className={index === active ? "GroupActive" : "Group"}
                                        onClick={() => {
                                            setCourier(el.id.toString());
                                            setMerchant('');
                                            setActive(index)
                                        }}
                                    >
                                        {el.firstname} {el.lastname}
                                    </div>)}
                                {!loadingCourier && couriers.length === 0 && (
                                    <div className="w-100 text-center">No Courier found</div>
                                )}
                                {!loadingMerchant && couriers.length !== 0 && couriers.length >= limit && (
                                    <div className="btn w-100 text-primary"
                                        onClick={() => setLimit(limit + 10)}
                                    >load 10 more</div>
                                )}
                            </>,
                        ]}
                        activeTab={0}
                    />
                </div>
                <div style={{
                    flex: 2,
                }}>
                    <div className="Container" style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            Total Undisbursed Amount
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <b style={{
                                fontSize: '1.2rem',
                                marginRight: 16,
                            }}>
                                Rp {info.total_undisbursed_transaction_amount}
                            </b>
                            <MyButton label="Disburse All"
                                disabled={disbursement.items.some(item => item.disbursement_date)}
                                onClick={() => {
                                    setSelected(disbursement.items);
                                    setDisburseModal(true);
                                }}
                            />
                            <Button label="Download .csv" icon={<FiDownload />}
                                onClick={() => {
                                    dispatch(downloadTransactionDisbursement(type, merchant, courier))
                                }}
                            />
                        </div>
                    </div>
                    <div className="Container" style={{
                    flex: 3,
                    flexDirection: 'column',
                }}>
                    <Table
                        onSelection={(selectedRows) => {
                            setSelected(selectedRows);
                        }}
                        noContainer={true}
                        totalItems={disbursement.total_items}
                        columns={columns}
                        data={disbursement.items}
                        loading={loading}
                        pageCount={disbursement.total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransactionDisbursement(pageIndex, pageSize, search,
                                type, merchant, courier));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, merchant, courier])}
                        filters={[]}
                        actions={[]}
                        renderActions={(selectedRowIds, page) => {
                            return ([
                                <Button
                                    disabled={Object.keys(selectedRowIds).length === 0}
                                    onClick={() => {
                                        setDisburseModal(true);
                                    }}
                                    icon={<FiCheck />}
                                    label="Disburse Selection"
                                />
                            ])
                        }}
                    />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component;


const InputSearch = (props) => (
    <div className="search-input mb-3">
        <label htmlFor="search"><FiSearch /></label>
        <input className="py-2" {...props} id="search" type="text" placeholder="Search" />
    </div>
)