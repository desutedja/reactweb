import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiCheck, FiFile } from 'react-icons/fi';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Modal from '../../components/Modal';
import { getBillingUnitDetails, getBillingSettlement } from './slice';
import { endpointAdmin, endpointBilling } from '../../settings';
import { get, toMoney } from '../../utils';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Building', accessor: 'building_name' },
    { Header: 'Unit', accessor: 'unit_id' },
    { Header: 'Management', accessor: 'management_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
    { Header: 'Settlement', accessor: row => row.payment_settled_date ? row.payment_settled_date : '-' },
    // { Header: 'Disbursement', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
]

const formatValue = (value) => toMoney(value.toFixed(0));

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, settlement, refreshToggle, alert } = useSelector(state => state.billing);

    const [search, setSearch] = useState('');

    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [unit, setUnit] = useState('');
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState('');

    const [month, setMonth] = useState('');
    const [monthName, setMonthName] = useState('');

    const [year, setYear] = useState('');
    const [yearSet, setYearSet] = useState('');

    const [info, setInfo] = useState({});

    const [settleModal, setSettleModal] = useState(true);
    const [selected, setSelected] = useState([]);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const getSum = items => {
        return items.reduce((sum, el) => {
            return sum + el.selling_price
        }, 0)
    }

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        building && (!search || search.length >= 3) && get(endpointAdmin + '/building/unit' +
            '?limit=5&page=1' +
            '&building_id=' + building +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: `${el.unit_type_name}-${el.unit_size} 
                    ${el.section_name} F${el.floor} ${el.number}`,
                    value: el.id
                }));

                setUnits(formatted);
            })
    }, [headers, search, building]);

    useEffect(() => {
        get(endpointBilling + '/management/billing/settlement/info', headers, res => {
            setInfo(res.data.data);
        })
    }, []);

    return (
        <div>
            <Modal isOpen={settleModal} toggle={() => setSettleModal(!settleModal)}
                title="Settlement Selection">
                <div style={{
                    display: 'flex',
                    marginBottom: 16,
                }}>
                    <Input compact label="Search" icon={<FiSearch />} />
                    <Button label="Add" />
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
            <Switch>
                {/* <Redirect exact from={path} to={`${path}`} /> */}
                <Route path={`${path}`}>
                    <div className="Container">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                        }}>
                            <div>
                                Settled Amount
                            <AnimatedNumber className="BigNumber" value={info.settled_amount}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div>
                                Unsettled Amount
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
                            <div>
                                Disbursed Amount
                            <AnimatedNumber className="BigNumber" value={info.disbursed_amount}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div>
                                Undisbursed Amount
                            <AnimatedNumber className="BigNumber" value={info.undisbursed_amount}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                    </div>
                    <Table totalItems={settlement.total_items}
                        onSelection={(selectedRows) => {
                            setSelected(selectedRows);
                        }}
                        columns={columns}
                        data={settlement.items}
                        loading={loading}
                        pageCount={settlement.total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBillingSettlement(headers, pageIndex, pageSize, search,
                                building, unit, month, yearSet));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, building, unit, month, yearSet])}
                        filters={[
                            {
                                button: <Button key="Select Building"
                                    label={building ? buildingName : "Select Building"}
                                    selected={building}
                                />,
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
                            },
                        ]}
                        actions={[]}
                        renderActions={(selectedRowIds, page) => {
                            // console.log(selectedRowIds, page);
                            return ([
                                <Button
                                    disabled={Object.keys(selectedRowIds).length === 0}
                                    onClick={() => {
                                        setSettleModal(true);
                                    }}
                                    icon={<FiCheck />}
                                    label="Settle"
                                />,
                                <Button
                                    onClick={() => { }}
                                    icon={<FiFile />}
                                    label="Settle From File"
                                />,
                            ])
                        }}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
