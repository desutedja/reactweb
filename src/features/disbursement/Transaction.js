import React, { useCallback, useEffect, useState, useMemo } from 'react';
// import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import ClinkLoader from '../../components/ClinkLoader';
import { FiCheck, FiSearch, FiDownload, FiXCircle } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";
import Tab from '../../components/Tab';
import Breadcrumb from '../../components/Breadcrumb';
import { ListGroup, ListGroupItem, Card } from 'reactstrap';
import moment from 'moment';

import Table from '../../components/TableWithSelection';
import { getTransactionDisbursement, refresh, downloadTransactionDisbursement } from '../slices/transaction';
import { trxStatusColor, endpointManagement } from '../../settings';
import { toMoney, toSentenceCase, dateTimeFormatterCell, isRangeToday } from '../../utils';
import Pill from '../../components/Pill';
import Filter from '../../components/Filter';
import { endpointTransaction, endpointMerchant } from '../../settings';
import { get, post } from '../slice';
import MyButton from '../../components/Button';
import Transaction from '../../components/cells/Transaction';
import DateRangeFilter from '../../components/DateRangeFilter';

const formatValue = (value) => toMoney(value.toFixed(0));

const tabs = [
    "Merchant", "Courier"
]

function Component({ view }) {
    const [info, setInfo] = useState({});
    const [selectedId, setSelectedId] = useState([]);
    const [selected, setSelected] = useState([]);
    const [limit, setLimit] = useState(5);
    const [status, setStatus] = useState('');
    const [filter, setFilter] = useState('undisbursed');
    const [loadingMerchant, setLoadingMerchant] = useState(false)
    const [loadingCourier, setLoadingCourier] = useState(false)
    const [transferCode, setTransferCode] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const [type, setType] = useState('merchant');
    const [disburseModal, setDisburseModal] = useState(false);
    const [merchant, setMerchant] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [courier, setCourier] = useState('');
    const [couriers, setCouriers] = useState([]);

    const today = moment().format("yyyy-MM-DD", 'day');
    const [settledStart, setSettledStart] = useState(today);
    const [settledEnd, setSettledEnd] = useState(today);
    const [disbursedStart, setDisbursedStart] = useState(today);
    const [disbursedEnd, setDisbursedEnd] = useState(today);

    const { loading, refreshToggle, disbursement } = useSelector(state => state.transaction);

    let dispatch = useDispatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return type === 'merchant' ? sum + el.total_selling_price : sum + el.assignee_fee;
        }, 0)
    }

    const filtersDisbursement = [
        { label: 'Disbursed', value: 'disbursed' },
        { label: 'Undisbursed', value: 'undisbursed' },
    ]

    const filterStatus = [
        { label: 'Disbursed Transaction', value: 'disbursed' },
        { label: 'Undisbursed Transaction', value: 'undisbursed' }
    ]

    const columns = useMemo(() => {
        if (type === 'merchant') return [
            { Header: 'ID', accessor: 'id' },
            {
                Header: 'Trx Code', accessor: row => <Transaction items={[row.trx_code]} trxcode={row.trx_code} />
            },
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
                Header: 'Disbursed Date', accessor: row => type === 'merchant' ?
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
                    :
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
            },
            { Header: 'Payment Channel', accessor: row => toSentenceCase(row.payment_bank) },
        ]
        else return [
            { Header: 'ID', accessor: 'id' },
            {
                Header: 'Ref Code', accessor: row => <Transaction items={[row.ref_code]} trxcode={row.ref_code} />
            },
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
                Header: 'Disbursed Date', accessor: row => type === 'merchant' ?
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
                    :
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
            },
            { Header: 'Payment Channel', accessor: row => toSentenceCase(row.disbursement_bank).toUpperCase() },
        ]
    }, [type]);

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary', res => {
            setInfo(res.data.data);
        }));
    }, [dispatch]);

    useEffect(() => {
        setLimit(5);
        setSelectedId([]);
    }, [type])

    useEffect(() => {
        setTimeout(() => {

            setLoadingMerchant(true);
            setLoadingCourier(true);

            type === 'merchant' && dispatch(get(endpointMerchant +
                '/admin/list?filter=' + filter +
                '&limit=' + limit +
                '&search=' + searchValue +
                '&extra=disbursement',
                res => {
                    setMerchants(res.data.data.items);
                    setLoadingMerchant(false);
                },
                err => {
                    console.log('FAILED GET LIST DISBURSEMENT MERCHANT:', err)
                    setLoadingMerchant(false);
                }));

            type === 'courier' && dispatch(get(endpointManagement +
                '/admin/staff/list?filter=' + filter +
                '&limit=' + limit +
                '&search=' + searchValue,
                res => {
                    setCouriers(res.data.data.items);
                    setLoadingCourier(false);
                },
                err => {
                    console.log('FAILED GET LIST DISBURSEMENT COURIER:', err)
                    setLoadingCourier(false);
                }));

        }, searchValue ? 1000 : 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, searchValue, limit, filter]);

    useEffect(() => {
        type === 'merchant' ?
        setMerchant(selectedId.map(item => item.id).join(',')) :
        setCourier(selectedId.map(item => item.id).join(','));
    }, [selectedId, type]);

    return (
        <>
            <Breadcrumb title='Disbursement' />
            <Modal
                isOpen={disburseModal} toggle={() =>
                    setDisburseModal(!disburseModal)
                }
                title="Disbursement Selection"
                okLabel="Flag as Disbursed"
                disabledOk={transferCode.length === 0}
                onClick={() => {
                    if (!transferCode) return;
                    const trx_codes = selected.map(el => el.trx_code)
                    const ref_codes = selected.map(el => el.ref_code)
                    const dataDisburse = type === 'merchant' ? {
                        trx_codes,
                        merchant_id: Number(merchant),
                        amount: getSum(selected),
                        disbursed_code: transferCode
                    } : {
                            trx_codes: ref_codes,
                            courier_id: Number(courier),
                            amount: getSum(selected),
                            disbursed_code: transferCode
                        }

                    if (type === 'merchant') dispatch(post(endpointTransaction +
                        '/admin/disbursement/merchant/create',
                        dataDisburse,
                        res => {
                            setDisburseModal(false);
                            dispatch(refresh());
                        }))
                    if (type === 'courier') dispatch(post(endpointTransaction +
                        '/admin/disbursement/courier/create',
                        dataDisburse,
                        res => {
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
                    <Input
                        type="text"
                        label="Transfer Code"
                        placeholder="Input transfer code as evidence for this disbursement"
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
                        padding: '10px',
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
                        padding: '10px',
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
                        padding: '10px',
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
                        padding: '10px',
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
                        padding: '10px',
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
                        padding: '10px',
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
            <div className="row no-gutters">
                <div className="col-12 col-md-4 col-lg-3">
                    <Card className="Container" style={{
                        flexDirection: 'column',
                        boxShadow: 'none',
                    }}>
                        <Tab
                            labels={tabs}
                            setTab={setType}
                            activeTab={0}
                            contents={[
                                <>
                                    <div className="row no-gutters align-items-center mb-4">
                                        <div className="col">
                                            <h5 style={{
                                                marginBottom: 0,
                                                minWidth: 100
                                            }}>Select Merchant</h5>
                                        </div>
                                        <div className="col-auto">
                                            <select style={{
                                                borderRadius: '4px',
                                                border: '1px solid silver',
                                                padding: '6px 4px'
                                            }}
                                                onChange={e => {
                                                    setFilter(e.target.value)
                                                }}
                                            >
                                                <option selected={true} value="">All</option>
                                                {filtersDisbursement.map(item => (
                                                    <option selected={item.value === filter} value={item.value}>{item.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <InputSearch value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                                    {loadingMerchant && <div className="w-100 py-5 d-flex justify-content-center">
                                        <ClinkLoader />
                                    </div>}
                                    <ListGroup>
                                        {!loadingMerchant && merchants
                                            .map((el, index) => <ListGroupItem style={{ cursor: 'pointer' }}
                                                key={index}
                                                tag="b"
                                                // active={index === active}
                                                active={selectedId.some(item => item.id === el.id)}
                                                onClick={() => {
                                                    setCourier('');
                                                    !selectedId.some(item => item.id === el.id) ?
                                                        setSelectedId([
                                                            ...selectedId,
                                                            el
                                                        ]) :
                                                        setSelectedId(selectedId.filter(item => item.id !== el.id))
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>{el.name}</div>
                                                    <div style={{ display: 'flex' }}>
                                                        { /* <Pill color="success">{el.disbursed_count}</Pill> */}
                                                        {el.undisbursed_count > 0 && <Pill color={"warning"}>
                                                            {el.undisbursed_count}
                                                        </Pill>}
                                                    </div>
                                                </div>
                                            </ListGroupItem>)}
                                    </ListGroup>
                                    {!loadingMerchant && merchants.length === 0 && (
                                        <div className="w-100 text-center">No Merchant found</div>
                                    )}
                                    {!loadingMerchant && merchants.length !== 0 && merchants.length >= limit && (
                                        <div className="btn w-100 text-primary"
                                            onClick={() => setLimit(limit + 10)}
                                        >load more</div>
                                    )}
                                </>,
                                <>
                                    <div className="row no-gutters align-items-center mb-4">
                                        <div className="col">
                                            <h5 style={{
                                                marginBottom: 0,
                                                minWidth: 100
                                            }}>Select Courier</h5>
                                        </div>
                                        <div className="col-auto">
                                            <select style={{
                                                borderRadius: '4px',
                                                border: '1px solid silver',
                                                padding: '6px 4px'
                                            }}
                                                onChange={e => {
                                                    setFilter(e.target.value)
                                                }}
                                            >
                                                <option selected={true} value="">All</option>
                                                {filtersDisbursement.map(item => (
                                                    <option selected={item.value === filter} value={item.value}>{item.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <InputSearch value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                                    {loadingCourier && <div className="w-100 py-5 d-flex justify-content-center">
                                        <ClinkLoader />
                                    </div>}
                                    <ListGroup>
                                        {!loadingCourier && couriers
                                            .map((el, index) => <ListGroupItem style={{ cursor: 'pointer' }}
                                                key={index}
                                                tag="b"
                                                active={selectedId.some(items => items.id === el.id)}
                                                onClick={() => {
                                                    setMerchant('');
                                                    !selectedId.some(items => items.id === el.id) ?
                                                    setSelectedId([
                                                        ...selectedId,
                                                        el
                                                    ]) :
                                                    setSelectedId(selectedId.filter(items => items.id !== el.id))
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>{el.firstname} {el.lastname}</div>
                                                    <div>{}</div>
                                                </div>
                                            </ListGroupItem>)}
                                    </ListGroup>
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
                        />
                    </Card>
                </div>
                <div className="col-12 col-md">
                    <Card className="Container" style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'none',
                        flexDirection: 'row',
                    }}>
                        <div style={{ flex: 6 }}>
                            <p>
                                Undisbursed Amount For {selectedId.length === 0 ?
                                (<b>{'All ' + toSentenceCase(type).replace(' ', '') + 's'}</b>) :
                                (selectedId.length > 1 ? toSentenceCase(type).replace(' ', '') + 's' :
                                toSentenceCase(type)).replace(' ', '') + ' :' }
                            </p>
                            {selectedId && selectedId.map(el => <>
                                <div
                                style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    backgroundColor: '#d9d9d9',
                                    borderRadius: 80,
                                    paddingLeft: 6,
                                    paddingRight: 6 + 18,
                                    marginRight: 6,
                                    marginBottom: 4,
                                    marginTop: 10,
                                }}
                                >
                                    <>{type === "merchant" ? el.name : el.firstname + " " + el.lastname}</>
                                    <FiXCircle
                                    onClick={() => {
                                        setSelectedId(selectedId.filter(items => items.id !== el.id))
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 6,
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                    />
                                </div>  
                            </>)}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <b style={{
                                fontSize: '1.2rem',
                                marginRight: 16,
                            }}>
                                {toMoney(disbursement.items.undisbursed_amount)}
                            </b>
                            {view ? null : <MyButton label="Disburse All"
                                disabled={disbursement.items?.undisbursed_amount === 0}
                                onClick={() => {
                                    setSelected(disbursement.items.data.filter(el => el && !el.disbursement_date));
                                    setDisburseModal(true);
                                }}
                            />}
                            <Button label="Download .csv" icon={<FiDownload />}
                                onClick={() => {
                                    dispatch(downloadTransactionDisbursement(type, merchant, courier))
                                }}
                            />
                        </div>
                    </Card>
                    <Card className="Container" style={{
                        flex: 3,
                        flexDirection: 'column',
                        boxShadow: 'none',
                    }}>
                        <Table
                            filterExpanded={true}
                            onSelection={(selectedRows) => {
                                console.log(selectedRows);
                                setSelected(selectedRows.filter(el => el && !el.disbursement_date));
                            }}
                            noContainer={true}
                            totalItems={disbursement.total_items}
                            columns={columns}
                            data={disbursement.items.data || []}
                            loading={loading}
                            pageCount={disbursement.total_pages}
                            fetchData={useCallback((pageIndex, pageSize, search) => {
                                dispatch(getTransactionDisbursement(pageIndex, pageSize, search,
                                    type, merchant, courier, status.value,
                                    ...(status.value === 'disbursed' ? [disbursedStart, disbursedEnd] : [today, today]),
                                    settledStart, settledEnd,
                                ));
                                // eslint-disable-next-line react-hooks/exhaustive-deps
                            }, [dispatch, refreshToggle, merchant, courier, type, disbursedStart, disbursedEnd, settledStart, settledEnd, status])}
                            filters={[
                                {
                                    hidex: isRangeToday(settledStart, settledEnd),
                                    label: "Settlement Date: ",
                                    delete: () => { setSettledStart(today); setSettledEnd(today) },
                                    value: isRangeToday(settledStart, settledEnd) ? 'Today' :
                                        moment(settledStart).format('DD-MM-yyyy') + ' - '
                                        + moment(settledEnd).format('DD-MM-yyyy')
                                    ,
                                    component: (toggleModal) =>
                                        <DateRangeFilter
                                            title='Settled Date'
                                            startDate={settledStart}
                                            endDate={settledEnd}
                                            onApply={(start, end) => {
                                                setSettledStart(start);
                                                setSettledEnd(end);
                                                toggleModal();
                                            }} />
                                },
                                ...status.value === 'disbursed' ? [{
                                    hidex: isRangeToday(disbursedStart, disbursedEnd),
                                    label: "Disbursed Date: ",
                                    delete: () => { setDisbursedStart(today); setDisbursedEnd(today) },
                                    value: isRangeToday(disbursedStart, disbursedEnd) ? 'Today' :
                                        moment(disbursedStart).format('DD-MM-yyyy') + ' - '
                                        + moment(disbursedEnd).format('DD-MM-yyyy')
                                    ,
                                    component: (toggleModal) =>
                                        <DateRangeFilter
                                            title='Disbursed Date'
                                            startDate={disbursedStart}
                                            endDate={disbursedEnd}
                                            onApply={(start, end) => {
                                                setDisbursedStart(start);
                                                setDisbursedEnd(end);
                                                toggleModal();
                                            }} />
                                }] : [],
                                {
                                    hidex: status === '',
                                    label: "Status: ",
                                    delete: () => { setStatus('') },
                                    value: status ? status.label : 'All',
                                    component: (toggleModal) =>
                                        <Filter
                                            data={filterStatus}
                                            onClickAll={() => {
                                                setStatus('');
                                                toggleModal();
                                            }}
                                            onClick={el => {
                                                setStatus(el);
                                                toggleModal(false);
                                            }}
                                        />
                                },
                            ]}
                            actions={[]}
                            renderActions={view ? null : (selectedRowIds, page) => {
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
                    </Card>
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
