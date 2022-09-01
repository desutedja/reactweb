import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AnimatedNumber from "animated-number-react";
import ClinkLoader from '../../components/ClinkLoader';
import moment from 'moment';

import { Card, ListGroup, ListGroupItem } from 'reactstrap';
import Table from '../../components/TableWithSelection';
import Button from '../../components/Button';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import Pill from '../../components/Pill';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import { toMoney, dateTimeFormatterCell, toSentenceCase, isRangeToday, monthStart, monthEnd, isRangeThisMonth, toSentenceCase2 } from '../../utils';
import { getBillingDisbursement, refresh } from '../slices/billing';
import { endpointBilling } from '../../settings';
import { get, post, getFile } from '../slice';
import MyButton from '../../components/Button';
import { FiDownload, FiAlertCircle, FiCheck, FiXCircle, FiSearch } from 'react-icons/fi';
import DateRangeFilter from '../../components/DateRangeFilter';

const formatValue = (value) => toMoney(value.toFixed(0));

const filtersDisbursement = [
    { label: 'Disbursed Only', value: 'disbursed' },
    { label: 'Undisbursed Only', value: 'undisbursed' },
]

const payment_channel = [
    { label: "OVO", value: "ovo" },
    { label: "Credit Card", value: "credit_card" },
    { label: "BCA", value: "bca" },
    { label: "BRI", value: "bri" },
    { label: "BNI", value: "bni" },
    { label: "LinkAja", value: "linkaja" },
    { label: "LinkAja Direct", value: "linkaja-direct" },
    { label: "Gopay", value: "gopay" },
    { label: "Mandiri", value: "mandiri" },
];

function Component({ view }) {
    const [active, setActive] = useState(0);
    const [info, setInfo] = useState({});
    const [amount, setAmount] = useState('');
    const [modal, setModal] = useState(false);
    const [transferCode, setTransferCode] = useState('');
    const [destinationBank, setDestinationBank] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [status, setStatus] = useState('');
    const [paymentChannel, setPaymentChannel] = useState('');
    
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState([]);
    const [selectedManagement, setSelectedManagement] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataPages, setDataPages] = useState('');
    const [totalItems, setTotalItems] = useState('');

    const today = moment().format("yyyy-MM-DD", 'day');
    const [settledStart, setSettledStart] = useState(monthStart());
    const [settledEnd, setSettledEnd] = useState(monthEnd());
    const [disbursedStart, setDisbursedStart] = useState(today);
    const [disbursedEnd, setDisbursedEnd] = useState(today);

    const [refreshTable, setRefreshTable] = useState(false);

    const { disbursement, refreshToggle, loading } = useSelector(state => state.billing);

    const { role } = useSelector(state => state.auth);

    const columns = useMemo(() => ([
        {
            Header: 'Billing Refcode', accessor: row =>
                <Link href="#" className="Link" to={"/" + role + "/billing/disbursement/" + row.trx_code}>{row.trx_code}</Link>
        },
        { Header: 'Management', accessor: row => <>
                                                <div style={{ display: 'block' }}>
                                                    <div>{row.management_name}</div>
                                                    <div>{row.building_name}</div>
                                                </div>
                                                </>},
        { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
        {
            Header: 'Status', accessor: row =>
                row.disbursement_date ? <Pill color="success">Disbursed</Pill> :
                    <Pill color="secondary">Undisbursed</Pill>
        },
        {
            Header: 'Disbursed at', accessor: row => row.disbursement_date ?
                dateTimeFormatterCell(row.disbursement_date) : '-'
        },
        { Header: 'Payment Channel', accessor: row => toSentenceCase(row.payment_bank) },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ]), [data]);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBillingDisbursement(0, 1000, searchValue, filter));
    }, [dispatch, filter, searchValue]);

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/statistic', res => {
            setInfo(res.data.data);
        }))
    }, [dispatch]);

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.selling_price
        }, 0)
    }

    return (
        <div>
            <Breadcrumb title="Disbursement" />
            <Modal isOpen={modal} toggle={() => {
                // setSelected([]);
                setModal(!modal)
            }}
                title="Disbursement Selection"
                okLabel="Flag as Disbursed"
                disabledOk={transferCode.length === 0 ||
                    selected.length === 0
                }
                onClick={() => {
                    if (!transferCode) return;
                    const dataDisbursement = {
                        trx_code: selected.map(el => el.trx_code),
                        disbursement_transfer_code: transferCode,
                    }
                    dispatch(post(endpointBilling + '/management/billing/disbursement/flag',
                        dataDisbursement,
                        res => {
                            dispatch(refresh());
                            setRefreshTable(!refreshTable);
                            setModal(false);
                            // console.log(res)
                        },
                        err => {
                            // console.log(err.response)
                        }))
                }}
            >
                <div style={{ marginBottom: 32 }}>
                    <Input
                        type="text"
                        label="Transfer Code"
                        placeholder="Input bank transfer code as evidence"
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
                        <AnimatedNumber className="BigNumber" value={info.total_undisburse_amount}
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
                        <AnimatedNumber className="BigNumber" value={info.total_disburse_amount}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-12 col-md-5 col-lg-3">
                    <Card className="Container" style={{ boxShadow: 'none' }} >
                        <div className="row no-gutters align-items-center mb-4">
                            <div className="col">
                                <h5 style={{
                                    marginBottom: 0,
                                    minWidth: 100
                                }}>Select Management</h5>
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
                            {loading && <div className="w-100 py-5 d-flex justify-content-center">
                                <ClinkLoader />
                            </div>}
                        <ListGroup
                            style={{
                                border: 'none'
                            }}
                        >
                            {!loading && disbursement.items.length > 0 ? disbursement.items.map((el, index) => <ListGroupItem
                                key={index}
                                onClick={() => {
                                    if (!selectedManagement.some(item => item.id === el.id)) {
                                        setSelectedManagement([
                                            ...selectedManagement,
                                            el
                                        ])
                                        return;
                                    }
                                    setSelectedManagement(selectedManagement.filter(item => item.id !== el.id));
                                }}
                                active={selectedManagement.some(item => item.id === el.id)}
                                action
                                tag="a"
                                href="#"
                            >
                                <div style={{ display: 'block' }}>
                                    <div><b>{el.management_name} <span style={{ color: "red" }}>{el.status === 'inactive' ? '(Inactive)' : ''}</span></b></div>
                                    <div>{el.building_name}</div>
                                    {(!el.settlement_account_name || !el.settlement_account_no || !el.settlement_bank) && 
                                    <div style={{ color: 'red' }}><FiAlertCircle /> Disbursement account information not set</div>}
                                </div>
                            </ListGroupItem>) : !loading && <div className="w-100 text-center">No Management found</div>}
                        </ListGroup>
                    </Card>
                </div>
                <div className="col-12 col-md">
                    <div style={{
                        flex: 4,
                        flexDirection: 'column',
                    }}>
                        <Card className="Container" style={{
                            boxShadow: 'none',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                            <div className="d-flex flex-column justify-content-center" style={{ flex: 7 }}>
                                <p>
                                    Undisbursed Amount For {selectedManagement.length > 0 ? <b>Management:</b> :
                                    <b>All Managements</b>}
                                </p>
                                <div className="d-flex w-100 flex-wrap">
                                    {selectedManagement && selectedManagement.map(el => <>
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
                                            marginTop: 8,
                                        }}
                                        >
                                            <>{el.management_name}</>
                                            <FiXCircle
                                            onClick={() => {
                                                setSelectedManagement(selectedManagement.filter(item => item.id !== el.id));
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
                                {view ? null : <MyButton label="Disburse All"
                                    disabled={amount && amount === 0}
                                    onClick={() => {
                                        setSelected(data.filter(el => el && !el.disbursement_date));
                                        setModal(true);
                                    }} />}
                                <Button fontWeight={500} className="Download" label="Download.csv" icon={<FiDownload />}
                                    onClick={() => dispatch(getFile(endpointBilling + '/management/billing/disbursement/list/transaction'
                                        + '?management_id=' + selectedManagement.map(item => item.id).join(',')
                                        + '&disbursement_date_min=' + (status === 'disbursed' ? disbursedStart : '')
                                        + '&disbursement_date_max=' + (status === 'disbursed' ? disbursedEnd : '')
                                        + '&settlement_date_min=' + settledStart
                                        + '&settlement_date_max=' + settledEnd
                                        + '&filter=' + status
                                        + '&payment_channel=' + paymentChannel
                                        + '&export=true',
                                        'billing_disbursement.csv',
                                        res => {}))}
                                />
                            </div>
                        </Card>
                        <Card className="Container" style={{ boxShadow: 'none' }}>
                            <Table
                                onSelection={(selectedRows) => {
                                    setSelected(selectedRows.filter(el => el && !el.disbursement_date));
                                }}
                                filterExpanded={true}
                                noContainer={true}
                                columns={columns}
                                data={data || []}
                                totalItems={totalItems}
                                loading={dataLoading}
                                pageCount={dataPages}
                                fetchData={useCallback((pageIndex, pageSize, search) => {
                                    setDataLoading(true);
                                    dispatch(get(endpointBilling + '/management/billing/disbursement/list/transaction?limit='
                                        + pageSize + '&page=' + (pageIndex + 1) + '&search=' + search
                                        + '&management_id=' + selectedManagement.map(item => item.id).join(',')
                                        + '&disbursement_date_min=' + (status === 'disbursed' ? disbursedStart : '')
                                        + '&disbursement_date_max=' + (status === 'disbursed' ? disbursedEnd : '')
                                        + '&settlement_date_min=' + settledStart
                                        + '&settlement_date_max=' + settledEnd
                                        + '&filter=' + status
                                        + '&payment_channel=' + paymentChannel,
                                        res => {
                                            const data = res.data.data.items
                                            setData(data);
                                            setDataPages(res.data.data.filtered_page);
                                            setTotalItems(res.data.data.filtered_item);
                                            setDataLoading(false);
                                    }))
                                    dispatch(get(endpointBilling + '/management/billing/disbursement/management/amount'
                                    + '?management_id=' + selectedManagement.map(item => item.id).join(',') + '&payment_channel=' + paymentChannel + '&filter=' + status,
                                    res => {
                                        setAmount(res.data.data.undisburse_amount);
                                    }))
                                }, [dispatch, selectedManagement, status, disbursedStart, disbursedEnd, settledStart, settledEnd, paymentChannel, refreshTable])}
                                filters={[
                                    {
                                        hidex: isRangeThisMonth(settledStart, settledEnd),
                                        label: "Settlement Date: ",
                                        delete: () => { setSettledStart(monthStart()); setSettledEnd(monthEnd()) },
                                        value: moment(settledStart).format('DD-MM-yyyy') + ' - '
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
                                    }
                                    ,
                                    ...status === 'disbursed' ? [{
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
                                        value: status ? toSentenceCase(status) : 'All',
                                        component: (toggleModal) =>
                                            <Filter
                                                data={[
                                                    { label: 'Undisbursed', value: 'undisbursed' },
                                                    { label: 'Disbursed', value: 'disbursed' },
                                                ]}
                                                onClickAll={() => {
                                                    setStatus('');
                                                    toggleModal();
                                                }}
                                                onClick={el => {
                                                    setStatus(el.value);
                                                    toggleModal(false);
                                                }}
                                            />
                                    },
                                    {
                                        hidex: paymentChannel === '',
                                        label: "Payment Channel: ",
                                        delete: () => { setPaymentChannel('') },
                                        // value: paymentChannel ? toSentenceCase(paymentChannel) : 'All',
                                        value: paymentChannel ? toSentenceCase2(paymentChannel) : 'All',
                                        component: (toggleModal) =>
                                            <Filter
                                                data={payment_channel}
                                                onClickAll={() => {
                                                    setPaymentChannel('');
                                                    toggleModal();
                                                }}
                                                onClick={el => {
                                                    setPaymentChannel(el.value);
                                                    toggleModal(false);
                                                }}
                                            />
                                    },
                                ]}
                                renderActions={view ? null : (selectedRowIds, page) => {
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

const InputSearch = (props) => (
    <div className="search-input mb-3">
        <label htmlFor="search"><FiSearch /></label>
        <input className="py-2" {...props} id="search" type="text" placeholder="Search" />
    </div>
)
