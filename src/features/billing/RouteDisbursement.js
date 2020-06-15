import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import Table from '../../components/Table';
import Add from './Add';
import Details from './Details';
import { getBillingDisbursement } from './slice';
import { get, toMoney } from '../../utils';
import { endpointBilling } from '../../settings';

const formatValue = (value) => toMoney(value.toFixed(0));

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const [active, setActive] = useState(0);
    const [info, setInfo] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, disbursement, total_pages, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        dispatch(getBillingDisbursement(headers, 0, 1000, ''));
    }, [dispatch, headers]);

    useEffect(() => {
        get(endpointBilling + '/management/billing/settlement/info', headers, res => {
            setInfo(res.data.data);
        })
    }, [headers]);

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
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        {disbursement.items.length > 0 && <div className="Container" style={{
                            flexDirection: 'column',
                            marginRight: 16,
                        }}>
                            {disbursement.items.map((el, index) => <div
                                className={index === active ? "GroupActive" : "Group"}
                                onClick={() => setActive(index)}
                            >
                                {el.billing_month}
                            </div>)}
                        </div>}
                        <div className="Container" style={{
                            flex: 3,
                            flexDirection: 'column',
                        }}>
                            <Table
                                columns={columns}
                                data={disbursement.items}
                                loading={loading}
                                pageCount={total_pages}
                                fetchData={useCallback((pageIndex, pageSize, search) => {
                                    // dispatch(getBillingDisbursement(headers, pageIndex, pageSize, search));
                                    // eslint-disable-next-line react-hooks/exhaustive-deps
                                }, [dispatch, refreshToggle, headers])}
                                filters={[]}
                                actions={[]}
                            />
                        </div>
                    </div>
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;