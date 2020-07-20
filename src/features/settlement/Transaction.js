import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiCheck, FiDownload } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";

import Filter from '../../components/Filter';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { getTransactionDetails, getTransactionSettlement, refresh, downloadTransactionSettlement } from '../slices/transaction';
import { trxStatusColor } from '../../settings';
import { toMoney, dateTimeFormatterCell, toSentenceCase } from '../../utils';
import { endpointTransaction } from '../../settings';
import Pill from '../../components/Pill';
import { get, post } from '../slice';
import MyButton from '../../components/Button';

const status_settlement = [
    { label: "Settled", value: "settled" },
    { label: "Unsettled", value: "unsettled" }
]

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Amount', accessor: row => toMoney(row.payment_amount - row.payment_charge) },
    {
        Header: 'Settlement Status', accessor: row => {
            return (
                row.payment_settled === 1 ?
                    <Pill color={trxStatusColor['paid']}>
                        {toSentenceCase('settled')}
                    </Pill> : <Pill color={trxStatusColor['requested']}>
                        {toSentenceCase('unsettled')}
                    </Pill>
            )
        }
    },
    {
        Header: 'Settlement Date', accessor: row => row.payment_settled_date ?
            dateTimeFormatterCell(row.payment_settled_date) : '-'
    },
];

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const [info, setInfo] = useState({});
    // const [inputValue, setInputValue] = useState('');

    const { loading, settlement, refreshToggle } = useSelector(state => state.transaction);

    const [statusSettlement, setStatusSettlement] = useState('')

    const [settleModal, setSettleModal] = useState(false);
    const [selected, setSelected] = useState([]);

    // console.log(selected)

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.total_price
        }, 0)
    }

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary', res => {
            setInfo(res.data.data);
        }));
    }, [dispatch]);

    useEffect(() => {
        console.log(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    return (
        <>
            <Modal isOpen={settleModal} toggle={() => setSettleModal(!settleModal)}
                title="Settlement Selection"
                okLabel="Flag as Settled"
                onClick={() => {
                    const currentDate = new Date().toISOString();
                    const trx_codes = selected.map(el => el.trx_code)
                    const dataSettle = {
                        trx_codes,
                        amount: getSum(selected),
                        settled_on: currentDate
                    }
                    dispatch(post(endpointTransaction + '/admin/transaction/settlement/create', dataSettle, res => {
                        setSettleModal(false);
                        dispatch(refresh());
                    }))
                }}
            >
                <div style={{
                    minHeight: 300,
                }}>
                    {selected.map(el => {
                        return (
                            <div key={el.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: 8,
                                marginBottom: 4,
                                border: '1px solid silver',
                                borderRadius: 4,
                            }}>
                                <div>
                                    <div>Trx Code</div>
                                    {el.trx_code}
                                </div>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>
                                    {toMoney(el.total_price)}
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
            <div className="Container">
                <Table
                    totalItems={settlement.total_items}
                    onSelection={(selectedRows) => {
                        setSelected(selectedRows);
                    }}
                    columns={columns}
                    data={settlement.items}
                    loading={loading}
                    pageCount={settlement.total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        dispatch(getTransactionSettlement(pageIndex, pageSize, search, statusSettlement.value));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, statusSettlement])}
                    onClickDetails={row => dispatch(getTransactionDetails(row, history, url))}
                    filters={[
                        {
                            hidex: statusSettlement === "",
                            label: <p>{statusSettlement ? "Status: " + statusSettlement.label : "Status: All"}</p>,
                            delete: () => { setStatusSettlement(""); },
                            component: (toggleModal) =>
                                <>
                                    <Filter
                                        data={status_settlement}
                                        onClick={(el) => {
                                            setStatusSettlement(el);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setStatusSettlement("");
                                            toggleModal(false);
                                        }}
                                    />
                                </>
                        },
                    ]}
                    actions={[]}
                    renderActions={(selectedRowIds, page) => {
                        // console.log(selectedRowIds);
                        return ([
                            <Button
                                disabled={Object.keys(selectedRowIds).length === 0}
                                onClick={() => {
                                    setSettleModal(true);
                                }}
                                icon={<FiCheck />}
                                label="Settle Selection"
                            />,
                            <MyButton label="Download .csv" icon={<FiDownload />}
                                onClick={() => {
                                    dispatch(downloadTransactionSettlement(statusSettlement))
                                }}
                            />
                        ])
                    }}
                />
            </div>
        </>
    )
}

export default Component;
