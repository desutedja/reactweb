import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { Card, ListGroup, ListGroupItem } from 'reactstrap';
import Table from '../../components/TableWithSelection';
import Button from '../../components/Button';
import Breadcrumb  from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import Pill from '../../components/Pill';
import Input from '../../components/Input';
import { getBillingDisbursement, downloadBillingDisbursement, refresh } from '../slices/billing';
import { toMoney, dateTimeFormatterCell, toSentenceCase } from '../../utils';
import { endpointBilling } from '../../settings';
import { get, post } from '../slice';
import MyButton from '../../components/Button';
import { FiDownload, FiCheck } from 'react-icons/fi';

const formatValue = (value) => toMoney(value.toFixed(0));

const columns = [
    { Header: 'Billing Refcode', accessor: 'trx_code' },
    // { Header: 'Unit', accessor: 'number' },
    { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
    { Header: 'Status', accessor: row => 
        row.disbursement_date ? <Pill color="success">Disbursed</Pill> : 
        <Pill color="secondary">Undisbursed</Pill> },
    {
        Header: 'Disbursed at', accessor: row => row.disbursement_date ?
            dateTimeFormatterCell(row.disbursement_date) : '-'
    },
    { Header: 'Payment Channel', accessor: row => toSentenceCase(row.payment_bank) },
]

function Component() {
    const [active, setActive] = useState(0);
    const [info, setInfo] = useState({});
    const [amount, setAmount] = useState('');
    const [modal, setModal] = useState(false);
    const [transferCode, setTransferCode] = useState('');

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataPages, setDataPages] = useState('');
    const [totalItems, setTotalItems] = useState('');

    const { disbursement, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBillingDisbursement(0, 1000, ''));
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/settlement/info', res => {
            setInfo(res.data.data);
        }))
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/disbursement/management/' +
            'amount?management_id=' + disbursement.items[active]?.id,
            res => {
                setAmount(res.data.data.undisburse_amount);
            }))
    }, [active, disbursement.items, dispatch]);

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.selling_price
        }, 0)
    }

    return (
        <div>
            <Breadcrumb title="Disbursement"/>
            <Modal isOpen={modal} toggle={() => {
                setSelected([]);
                setModal(!modal)
            }}
                title="Disbursement Selection"
                okLabel="Flag as Disbursed"
                disabledOk={transferCode.length === 0}
                onClick={() => {
                    if (!transferCode) return;
                    dispatch(post(endpointBilling + '/management/billing/disbursement/flag', {
                        trx_code: selected.map(el => el.trx_code),
                        disbursement_transfer_code: transferCode
                    }, res => {
                        dispatch(refresh());
                        setModal(false);
                    }))
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
                    {selected.map(el => <div key={el.id} style={{
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
                            {toMoney(el.selling_price)}
                        </div>
                    </div>)}
                </div>
                <div style={{
                    marginTop: 16,
                }}>
                    <h5>Total {toMoney(getSum(selected))}</h5>
                </div>
            </Modal>
                    <div className="Container">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            padding: '15px',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    marginRight: 16,
                                }}>
                                    Undisbursed Amount</div>
                                <AnimatedNumber className="BigNumber" value={info.undisbursed_amount}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            padding: '15px',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    marginRight: 16,
                                }}>
                                    Disbursed Amount</div>
                                <AnimatedNumber className="BigNumber" value={info.disbursed_amount}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginTop: 16,
                    }}>
                    
                    <div className="Container">
                        {disbursement.items.length > 0 && <Card className="Container" style={{ boxShadow: 'none' }} >
                            <ListGroup>
                            <h5 style={{ marginBottom: 16 }}>Select Management</h5> 
                            {disbursement.items.map((el, index) => <ListGroupItem
                                key={index}
                                onClick={() => setActive(index)}
                                active={index === active}
                                action
                                tag="a"
                                href="#"
                            >
                                <div style={{ display: 'block' }}>
                                    <div><b>{el.management_name}</b></div>
                                    <div>{el.building_name}</div>
                                </div>
                            </ListGroupItem>)}
                        </ListGroup></Card>}

                        <div style={{
                            flex: 4,
                            flexDirection: 'column',
                        }}>
                            <Card  className="Container" style={{
                                boxShadow: 'none',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                                <div className="d-flex align-items-center">
                                    Undisbursed Amount For&nbsp;<b>{disbursement.items.length > 0 && disbursement.items[active].management_name}</b>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <b style={{
                                        fontSize: '1.2rem',
                                        marginRight: 16,
                                    }}>
                                        {toMoney(amount)}
                                    </b>
                                    <MyButton label="Disburse All" onClick={() => {
                                        setSelected(data.filter(el => el && !el.disbursement_date));
                                        setModal(true);
                                    }} />
                                    <Button label="Download .csv" icon={<FiDownload />}
                                        onClick={() => dispatch(downloadBillingDisbursement())}
                                    />
                                </div>
                            </Card>
                            <Card className="Container" style={{ boxShadow: 'none' }}>
                                <Table
                                    onSelection={(selectedRows) => {
                                        setSelected(selectedRows.filter(el => !el.disbursement_date));
                                    }}
                                    noContainer={true}
                                    columns={columns}
                                    data={data}
                                    totalItems={totalItems}
                                    loading={dataLoading}
                                    pageCount={dataPages}
                                    fetchData={useCallback((pageIndex, pageSize, search) => {
                                        setDataLoading(true);
                                        dispatch(get(endpointBilling + '/management/billing/disbursement' +
                                            '/list/transaction?limit=1000&page=1&search='
                                            + search + '&building_id=' +
                                            disbursement.items[active]?.building_id
                                            + '&management_id=' +
                                            disbursement.items[active]?.id,
                                            res => {
                                                setData(res.data.data.items);
                                                setDataPages(res.data.data.total_pages);
                                                setTotalItems(res.data.data.total_items);
                                                setDataLoading(false);
                                            }))
                                        // eslint-disable-next-line react-hooks/exhaustive-deps
                                    }, [dispatch, refreshToggle, active])}
                                    renderActions={(selectedRowIds, page) => {
                                        return ([
                                            <Button
                                                disabled={Object.keys(selectedRowIds).length === 0}
                                                onClick={() => {
                                                    setModal(true);
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
              </div>
        </div>
    )
}

export default Component;
