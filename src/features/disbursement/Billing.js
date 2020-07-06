import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import { getBillingDisbursement } from '../slices/billing';
import { toMoney } from '../../utils';
import { endpointBilling } from '../../settings';
import { get } from '../slice';

const formatValue = (value) => toMoney(value.toFixed(0));

const columns = [
    { Header: 'Billing Refcode', accessor: 'payment_ref_code' },
    { Header: 'Unit', accessor: 'number' },
    { Header: 'Amount', accessor: row => toMoney(row.selling_price) },
]

function Component() {
    const [active, setActive] = useState(0);
    const [info, setInfo] = useState({});

    const [data, setData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataPages, setDataPages] = useState('');

    const { disbursement, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let { path } = useRouteMatch();

    useEffect(() => {
        dispatch(getBillingDisbursement( 0, 1000, ''));
    }, [dispatch, ]);

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/settlement/info',  res => {
            setInfo(res.data.data);
        }))
    }, [dispatch]);

    return (
        <div>
            <Switch>
                <Route exact path={path}>
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
                        marginTop: 16,
                    }}>
                        {disbursement.items.length > 0 && <div className="Container" style={{
                            flexDirection: 'column',
                            marginRight: 16,
                        }}>
                            <h5 style={{
                                marginBottom: 16,
                            }}>Select Management</h5>
                            {disbursement.items.map((el, index) => <div
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
                            <Table
                                columns={columns}
                                data={data}
                                loading={dataLoading}
                                pageCount={dataPages}
                                fetchData={useCallback((pageIndex, pageSize, search) => {
                                    setDataLoading(true);
                                    dispatch(get(endpointBilling + '/management/billing/disbursement' +
                                        '/list/transaction?limit=1000&page=1&search='
                                        + '&building_id=' +
                                        disbursement.items[active]?.building_id
                                        + '&management_id=' +
                                        disbursement.items[active]?.id,
                                         res => {
                                            setData(res.data.data.items);
                                            setDataPages(res.data.data.total_pages);
                                            setDataLoading(false);
                                        }))
                                    // eslint-disable-next-line react-hooks/exhaustive-deps
                                }, [dispatch, refreshToggle,  active])}
                                filters={[]}
                                actions={[]}
                            />
                        </div>
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default Component;