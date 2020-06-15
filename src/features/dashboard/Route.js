import React, { useEffect, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { getSOS } from './slice';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, PieChart, Pie, BarChart, Legend, Bar } from 'recharts';
import { dateFormatter, get, toMoney } from '../../utils';
import { endpointTask, endpointAdmin, endpointAds, endpointBilling, endpointManagement } from '../../settings';

import './style.css';

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
    // task
    const [range, setRange] = useState('daily');
    const [pieData, setPieData] = useState([]);
    const [taskData, setTaskData] = useState({});

    // ads
    const [adsData, setAdsData] = useState([]);

    // billing
    const [billingData, setBillingData] = useState({});
    const [staffData, setStaffData] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, sosData } = useSelector(state => state.dashboard);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        dispatch(getSOS(headers, range));
    }, [range]);

    useEffect(() => {
        get(endpointTask + '/admin/sa/statistics', headers, res => {
            setPieData(res.data.data.ticket_by_category);
            setTaskData(res.data.data);
        })
    }, []);

    useEffect(() => {
        get(endpointAds + '/management/ads/report/overview', headers, res => {
            setAdsData(res.data.data);
        })
    }, []);

    useEffect(() => {
        get(endpointBilling + '/management/billing/statistic', headers, res => {
            setBillingData(res.data.data);
        })
    }, []);

    useEffect(() => {
        get(endpointManagement + '/admin/staff/statistics', headers, res => {
            setStaffData(res.data.data);
        })
    }, []);

    return (
        <div>
            <Switch>
                {/* <Redirect from={path} to={`${path}/task`} /> */}
                <Route exact path={`${path}/task`}>
                    <div className="Container" style={{
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 16,
                        }}>
                            <h5>SOS Statistics</h5>
                            <div style={{
                                display: 'flex',
                            }}>
                                <div className={range === 'daily' ? "GroupActive" : "Group"}
                                    onClick={() => setRange('daily')
                                    }>
                                    DTD
                                    </div>
                                <div className={range === 'monthly' ? "GroupActive" : "Group"}
                                    onClick={() => setRange('monthly')
                                    }>
                                    MTD
                                    </div>
                                <div className={range === 'annual' ? "GroupActive" : "Group"}
                                    onClick={() => setRange('annual')
                                    }>
                                    YTD
                                    </div>
                            </div>
                        </div>
                        <AreaChart width={730} height={250} data={sosData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" tickFormatter={dateFormatter} />
                            <YAxis dataKey="num_of_sos" />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="time" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                            <Area type="monotone" dataKey="num_of_sos" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </div>
                    <div className="Row">
                        <div className="Container" style={{
                            flexDirection: 'column'
                        }}>
                            <h5>Task Categories</h5>
                            <PieChart width={730} height={250}>
                                <Pie data={pieData} dataKey="num_of_task" nameKey="task_type"
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                    fill="#8884d8" label />
                                <Tooltip />
                            </PieChart>
                        </div>
                        <div className="Container" style={{
                            marginLeft: 16,
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                flex: 1,
                            }}>
                                Total Task
                                <AnimatedNumber className="BigNumber" value={taskData.total_task}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Unresolved Task
                                <AnimatedNumber className="BigNumber" value={taskData.total_unresolved_task}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Resolved Task
                                <AnimatedNumber className="BigNumber" value={taskData.total_resolved_task}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path={`${path}/advertisement`}>
                    <div className="Container">
                        <BarChart width={1000} height={600} data={adsData}
                            layout='vertical'
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type='number' />
                            <YAxis type='category' dataKey="content_name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_click" fill="#8884d8" />
                            <Bar dataKey="total_view" fill="#82ca9d" />
                        </BarChart>
                    </div>
                </Route>
                <Route path={`${path}/billing`}>
                <div className="Container" style={{
                            // flexDirection: 'column'
                        }}>
                            <div style={{
                                flex: 1,
                            }}>
                                Resident
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Technician
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Security
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Merchant
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Courier
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Building Manager
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                General Manager
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                    <div className="Row">
                        <div className="Container" style={{
                            // flexDirection: 'column'
                        }}>
                            <div style={{
                                flex: 1,
                            }}>
                                Total Building
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Total Unit
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Average Unit
                                <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                                    / staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                        <div className="Container" style={{
                            marginLeft: 16,
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                flex: 1,
                            }}>
                                Paid Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_paid_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Unpaid Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_unpaid_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Settled Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_settle_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                            }}>
                                Unsettled Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_unsettled_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Disbursed Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_disburse_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Undisbursed Amount
                                <AnimatedNumber className="BigNumber" value={billingData.total_undisburse_amount}
                                    formatValue={formatValuetoMoney}
                                />
                            </div>
                        </div>
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default Component;