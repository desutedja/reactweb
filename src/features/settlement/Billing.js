import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link  } from 'react-router-dom';
import { FiSearch, FiCheck, FiFile, FiDownload } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";
import { ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment';

import Table from '../../components/TableWithSelection';
import Loading from '../../components/Loading';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Modal from '../../components/Modal';
import Pill from '../../components/Pill';
import { getBillingSettlement, downloadBillingSettlement, refresh } from '../slices/billing';
import { endpointAdmin, endpointBilling } from '../../settings';
import { toMoney, dateTimeFormatterCell, isRangeToday } from '../../utils';
import { get, post } from '../slice';
import DateRangeFilter from '../../components/DateRangeFilter';

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {

    const { auth } = useSelector(state => state);
    const { loading, settlement, refreshToggle } = useSelector(state => state.billing);

    const [search, setSearch] = useState('');

    const [settled, setSettled] = useState('');
    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [info, setInfo] = useState({});

    const [settleModal, setSettleModal] = useState(false);
    const [selected, setSelected] = useState([]);

    const fileInput = useRef();
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadResult, setUploadResult] = useState(false);
    const [fileUpload, setFileUpload] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);

    const today = moment().format('yyyy-MM-DD', 'day');
    const [settlementStart, setSettlementStart] = useState(today);
    const [settlementEnd, setSettlementEnd] = useState(today);

    let dispatch = useDispatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.selling_price
        }, 0)
    }

    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Ref Code', accessor: row =>  <Link class="Link" 
            to={"/" + auth.role + "/billing/settlement/" + row.trx_code}>{row.trx_code}</Link> },
        { Header: 'Building', accessor: 'building_name' },
        { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
        {
            Header: 'Settled', accessor: row => auth.role === 'bm' ? (row.payment_settled === 1 ? <Pill color="success">Settled</Pill> :
            <Pill color="secondary">Unsettled</Pill>) : (row.payment_settled_date ? <Pill color="success">Settled</Pill> :
                <Pill color="secondary">Unsettled</Pill>)
        },
        {
            Header: 'Settlement Date', accessor: row => auth.role === 'bm' ? (row.disbursement_date ?
            dateTimeFormatterCell(row.disbursement_date) : '- ') : (row.payment_settled_date ?
                dateTimeFormatterCell(row.payment_settled_date) : '-')
        },
    ], [])

    
    useEffect(() => {
        console.log(columns)
        if (auth.role === 'bm') {
            console.log(columns)
            return;
        }
    }, [auth.role, columns])

    useEffect(() => {
        (!search || search.length >= 1) && dispatch(get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            }))
    }, [dispatch, search]);

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/settlement/info', res => {
            setInfo(res.data.data);
        }))
    }, [dispatch]);

    return (
        <div>
            <h2 style={{ marginLeft: '16px', marginTop: '10px' }}>Billing Settlement</h2>
            <Breadcrumb title="Settlement" />
            <Modal
                isOpen={uploadModal}
                toggle={() => {
                    setUploadResult();
                    setUploadModal(false);
                }}
                title="Upload Settlement"
                subtitle="Upload csv from Xendit dashboard"
                okLabel={uploadResult && uploadResult.valid_transactions.length > 0 ? "Flag As Settled" : "Submit"}
                disablePrimary={loading || (uploadResult && uploadResult.valid_transactions.length === 0)}
                disableSecondary={loading}
                onClick={uploadResult ?
                    () => {
                        const trx_codes = uploadResult.valid_transactions.map(el => el.trx_code)
                        const dataSettle = {
                            trx_codes,
                        }
                        dispatch(post(endpointBilling + '/management/billing/settlement', dataSettle, res => {
                            setSettleModal(false);
                            dispatch(refresh());
                            dispatch(setInfo({
                                message: trx_codes.length + ' billing' + (trx_codes.length > 0 ? 's' : '') + ' was marked as settled',
                            }))
                        }))
                        setUploadResult('');
                        setUploadModal(false);
                    }
                    :
                    () => {
                        setLoadingUpload(true);

                        let formData = new FormData();
                        formData.append('file', fileUpload);

                        dispatch(post(endpointBilling + '/management/billing/settlement/validate/bulk',
                            formData,
                            res => {
                                setLoadingUpload(false);

                                setUploadResult(res.data.data);
                            },
                            err => {
                                setLoadingUpload(false);
                            }
                        ));
                    }}
            >
                {uploadResult ?
                    <div style={{ maxHeight: '600px', overflow: 'scroll' }} >
                        <ListGroup style={{ marginBottom: '15px' }}>
                            <div style={{ padding: '5px' }}><b>
                                Valid Transaction Codes: <span style={{ color: "green" }} >
                                    {uploadResult.valid_transactions.length + ' '}
                                    result{uploadResult.valid_transactions.length > 1 ? 's' : ''}</span>
                            </b></div>
                            {uploadResult.valid_transactions.map((el) =>
                                <ListGroupItem color={el.payment_amount - el.payment_charge !== el.xendit_amount ? "warning" : "success"}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>Trx Code</div> <b>Value: {toMoney(el.payment_amount - el.payment_charge)}</b>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>{el.trx_code}</div> <b>From Xendit: {toMoney(el.xendit_amount)}</b>
                                    </div>
                                    {el.payment_amount - el.payment_charge !== el.xendit_amount && <div style={{ color: "red" }}>
                                        There's difference between value of transaction and xendit amount.
                                    </div>}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                        <ListGroup>
                            <div style={{ padding: '5px' }}><b>
                                Invalid Transaction Codes: <span style={{ color: "red" }}>
                                    {uploadResult.invalid_transactions.length + ' '}
                                    result{uploadResult.invalid_transactions.length > 1 ? 's' : ''}</span>
                            </b></div>
                            {uploadResult.invalid_transactions.map((el) =>
                                <ListGroupItem color="danger">{el.trx_code} ({el.reason})</ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                    :
                    <Loading loading={loadingUpload}>
                        <input
                            ref={fileInput}
                            type="file"
                            onChange={e => {
                                setFileUpload(fileInput.current.files[0]);
                            }}
                        />
                    </Loading>
                }
            </Modal>
            <Modal isOpen={settleModal} toggle={() => {
                setSettleModal(!settleModal)
                setSelected([]);
            }}
                title="Settlement Selection"
                okLabel="Settle"
                onClick={() => {
                    dispatch(post(endpointBilling + '/management/billing/settlement', {
                        trx_code: selected.map(el => el.trx_code)
                    }, res => {
                        dispatch(refresh());
                        setSettleModal(false);
                    }))
                }}
            >
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
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            marginRight: 16,
                        }}>
                            Unsettled Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.unsettled_amount}
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
                        }}>
                            Settled Amount</div>
                        <AnimatedNumber className="BigNumber" value={info.settled_amount}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
            </div>
            <div className="Container">
                <Table
                    totalItems={settlement.total_items}
                    onSelection={(selectedRows) => {
                        setSelected(selectedRows.filter(el => el && !el.payment_settled_date));
                    }}
                    columns={columns}
                    data={settlement.items}
                    loading={loading}
                    pageCount={settlement.total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        dispatch(getBillingSettlement(pageIndex, pageSize, search,
                            building, settled,
                            ...(settled === '1' ? [settlementStart, settlementEnd] : [])
                        ));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, building, settled, settlementStart, settlementEnd])}
                    filters={auth.role === 'sa' ? [
                        ...settled === '1' ? [{
                            hidex: isRangeToday(settlementStart, settlementEnd),
                            label: "Settlement Date: ",
                            delete: () => { setSettlementStart(today); setSettlementEnd(today); },
                            value: isRangeToday(settlementStart, settlementEnd) ? 'Today' :
                                moment(settlementStart).format('DD-MM-yyyy') + ' - '
                                + moment(settlementEnd).format('DD-MM-yyyy'),
                            component: (toggleModal) =>
                                <DateRangeFilter
                                    startDate={settlementStart}
                                    endDate={settlementEnd}
                                    onApply={(start, end) => {
                                        setSettlementStart(start);
                                        setSettlementEnd(end);
                                        toggleModal();
                                    }} />
                        }] : [],
                        {
                            hidex: settled === "",
                            label: <p>Status: {settled ? (settled === '1' ? 'Settled' : "Unsettled") : "All"}</p>,
                            delete: () => setSettled(''),
                            component: (toggleModal) =>
                                <Filter
                                    data={[
                                        { value: '0', label: 'Unsettled' },
                                        { value: '1', label: 'Settled' },
                                    ]}
                                    onClick={(el) => {
                                        setSettled(el.value);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setSettled("");
                                        toggleModal(false);
                                    }}
                                />
                        },
                        {
                            hidex: building === "",
                            label: <p>Building: {building ? buildingName : "All"}</p>,
                            delete: () => setBuilding(''),
                            component: (toggleModal) =>
                                <>
                                    <Input
                                        label="Search"
                                        compact
                                        icon={<FiSearch />}
                                        inputValue={search}
                                        setInputValue={setSearch}
                                    />
                                    <Filter
                                        data={buildings}
                                        onClick={(el) => {
                                            setBuilding(el.value);
                                            setBuildingName(el.label);
                                            toggleModal(false);
                                            setSearch("");
                                        }}
                                        onClickAll={() => {
                                            setBuilding("");
                                            setBuildingName("");
                                            toggleModal(false);
                                            setSearch("");
                                        }}
                                    />
                                </>
                        }
                    ] : [
                            {
                                hidex: settled === "",
                                label: <p>Status: {settled ? (settled === '1' ? 'Settled' : "Unsettled") : "All"}</p>,
                                delete: () => setSettled(''),
                                component: (toggleModal) =>
                                    <Filter
                                        data={[
                                            { value: '0', label: 'Unsettled' },
                                            { value: '1', label: 'Settled' },
                                        ]}
                                        onClick={(el) => {
                                            setSettled(el.value);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setSettled("");
                                            toggleModal(false);
                                        }}
                                    />
                            }
                        ]}
                    renderActions={(selectedRowIds, page) => {
                        return ([
                            auth.role === 'sa' && <Button
                                disabled={Object.keys(selectedRowIds).length === 0}
                                onClick={() => {
                                    setSettleModal(true);
                                }}
                                icon={<FiCheck />}
                                label="Settle"
                            />,
                            auth.role === 'sa' && <Button
                                onClick={() => {
                                    setUploadModal(true);
                                }}
                                icon={<FiFile />}
                                label="Upload Settlement"
                            />,
                            <Button label="Download .csv" icon={<FiDownload />}
                                onClick={() => dispatch(downloadBillingSettlement(search, building))}
                            />
                        ])
                    }}
                />
            </div>
        </div>
    )
}

export default Component;
