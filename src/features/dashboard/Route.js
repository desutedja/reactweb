import React, { useEffect, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getSOS } from './slice';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip } from 'recharts';
import { dateFormatter, get } from '../../utils';
import { endpointTask } from '../../settings';

function Component() {
    const [range, setRange] = useState('daily');

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
                        <div className="Container">
                        </div>
                        <div className="Container" style={{
                            marginLeft: 16,
                        }}>
                        </div>
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default Component;