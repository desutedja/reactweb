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
import Breadcrumb from '../../components/Breadcrumb';
import { ListGroup, ListGroupItem, Card } from 'reactstrap';

import Table from '../../components/TableWithSelection';
import { getTransactionDisbursement, refresh, downloadTransactionDisbursement } from '../slices/transaction';
import { trxStatusColor, endpointManagement } from '../../settings';
import { toMoney, toSentenceCase, dateTimeFormatterCell } from '../../utils';
import Pill from '../../components/Pill';
import { endpointTransaction, endpointMerchant } from '../../settings';
import { get, post } from '../slice';
import MyButton from '../../components/Button';
import Transaction from '../../components/cells/Transaction';

const formatValue = (value) => toMoney(value.toFixed(0));

const tabs = [
    "Merchant", "Courier"
]

function Component() {
    const [info, setInfo] = useState({});
    const [active, setActive] = useState(0);
    const [selected, setSelected] = useState([]);
    const [limit, setLimit] = useState(5);
    const [filter, setFilter] = useState('');
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

    const filtersDisbursement = [
        {label: 'Disbursed Only', value: 'disbursed'},
        {label: 'Undisbursed Only', value: 'undisbursed'}
    ]

    const columns = useMemo(() => {
        if (type === 'merchant') return [
            { Header: 'ID', accessor: 'id' },
            {
                Header: 'Trx Code', accessor: row => <Transaction items={[row.trx_code]} id={row.trx_code} />
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
                Header: 'Disbursement Date', accessor: row => type === 'merchant' ?
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
                    :
                    row.disbursement_date ? dateTimeFormatterCell(row.disbursement_date) : '-'
            },
            { Header: 'Payment Channel', accessor: row => toSentenceCase(row.payment_bank) },
        ]
        else return [
            { Header: 'ID', accessor: 'id' },
            {
                Header: 'Ref Code', accessor: row => <Transaction items={[row.ref_code]} id={row.ref_code} />
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
                Header: 'Disbursement Date', accessor: row => type === 'merchant' ?
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
    }, [type])

    useEffect(() => {
        setTimeout(() => {

            setLoadingMerchant(true);
            setLoadingCourier(true);

            type === 'merchant' && dispatch(get(endpointMerchant +
            '/admin/list?filter=' + filter + 
            '&limit=' + limit +
            '&search=' + searchValue,
            res => {
                setMerchants(res.data.data.items);
                setMerchant(res.data.data.items[active].id);
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
                setCourier(res.data.data.items[active].id);
                setLoadingCourier(false);
            },
            err => {
                console.log('FAILED GET LIST DISBURSEMENT COURIER:', err)
                setLoadingCourier(false);
            }));
            
        }, searchValue ? 1000 : 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, searchValue, limit, filter]);


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
            <div style={{
                display: 'flex',
                marginTop: 16,
            }}>
                <Card className="Container" style={{
                    flexDirection: 'column',
                    marginRight: 16,
                    boxShadow: 'none',
                }}>
                    <Tab
                        labels={tabs}
                        setTab={setType}
                        tabActive={setActive}
                        activeTab={0}
                        contents={[
                            <>
                                <div className="row no-gutters align-items-center mb-4">
                                    <div className="col">
                                        <h5 style={{
                                            marginBottom: 0,
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
                                            {filtersDisbursement.map(filter => (
                                            <option value={filter.value}>{filter.label}</option>
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
                                    .map((el, index) => <ListGroupItem
                                        key={index}
                                        tag="a"
                                        href="#"
                                        active={index === active}
                                        onClick={() => {
                                            setMerchant(el.id.toString());
                                            setCourier('');
                                            setActive(index)
                                        }}
                                    >
                                        {el.name}
                                    </ListGroupItem>)}
                                </ListGroup>
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
                                <div className="row no-gutters align-items-center mb-4">
                                    <div className="col">
                                        <h5 style={{
                                            marginBottom: 0,
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
                                            {filtersDisbursement.map(filter => (
                                            <option value={filter.value}>{filter.label}</option>
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
                                    .map((el, index) => <ListGroupItem
                                        key={index}
                                        tag="a"
                                        href="#"
                                        active={index === active}
                                        onClick={() => {
                                            setCourier(el.id.toString());
                                            setMerchant('');
                                            setActive(index)
                                        }}
                                    >
                                        {el.firstname} {el.lastname}
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
                <div style={{
                    flex: 4,
                }}>
                    <Card className="Container" style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'none',
                        flexDirection: 'row',
                    }}>
                        <div>
                            Undisbursed Amount For {toSentenceCase(type)} {type === "merchant" ? 
                            <b>{(merchants.length > 0 ? merchants[active].name : '')}</b>
                        : <b>{(couriers.length > 0 ? couriers[active].name : '')}</b>}
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
                            <MyButton label="Disburse All"
                                disabled={disbursement.items.data.some(item => item.disbursement_date)}
                                onClick={() => {
                                    setSelected(disbursement.items.data);
                                    setDisburseModal(true);
                                }}
                            />
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
                        onSelection={(selectedRows) => {
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
                                type, merchant, courier, filter));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, merchant, courier, filter, type])}
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
