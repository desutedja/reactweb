import React, { useEffect, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { getSOS } from './slice';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, PieChart, Pie } from 'recharts';
import { dateFormatter, get } from '../../utils';
import { endpointTask } from '../../settings';

import './style.css';

const formatValue = (value) => value.toFixed(0);

function Component() {
    const [range, setRange] = useState('daily');
    const [pieData, setPieData] = useState([]);
    const [data, setData] = useState({});

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
            setData(res.data.data);
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
                                <AnimatedNumber className="BigNumber" value={data.total_task}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Unresolved Task
                                <AnimatedNumber className="BigNumber" value={data.total_unresolved_task}
                                    formatValue={formatValue}
                                />
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                Resolved Task
                                <AnimatedNumber className="BigNumber" value={data.total_resolved_task}
                                    formatValue={formatValue}
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