import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiCheck, FiFile, FiDownload } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";

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
import { toMoney, dateTimeFormatterCell } from '../../utils';
import { get, post } from '../slice';

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
    // const [uploadData, setUploadData] = useState('');
    const [uploadResult, setUploadResult] = useState(false);
    const [fileUpload, setFileUpload] = useState('');
    const [
        // loadingUpload,
         setLoadingUpload] = useState(false);

    let dispatch = useDispatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.selling_price
        }, 0)
    }

    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Trx Code', accessor: 'trx_code' },
        { Header: 'Building', accessor: 'building_name' },
        { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
        {
            Header: 'Settled', accessor: row => row.payment_settled_date ? <Pill color="success">Settled</Pill> :
                <Pill color="secondary">Unsettled</Pill>
        },
        {
            Header: 'Settlement Date', accessor: row => row.payment_settled_date ?
                dateTimeFormatterCell(row.payment_settled_date) : '-'
        },
    ], [])

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
            <Breadcrumb title="Settlement"/>
            <Modal
                isOpen={uploadModal}
                toggle={() => {
                    setUploadModal(false);
                }}
                title="Upload Settlement"
                subtitle="Upload csv from Xendit dashboard"
                okLabel={uploadResult ? "OK" : "Submit"}
                disablePrimary={loading}
                disableSecondary={loading}
                onClick={uploadResult ?
                    () => {
                        setUploadModal(false);
                        setUploadResult();
                    }
                    :
                    () => {
                        setLoadingUpload(true);
                            
                        let formData = new FormData();
                        formData.append('file', fileUpload);

                        dispatch(post(endpointBilling + 'TODO',
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
                    <div>
                        {JSON.stringify(uploadResult)}
                    </div>
                    :
                    <Loading loading={loading}>
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
                            building, settled));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, building, settled])}
                    filters={auth.role === 'sa' ? [
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
