import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { getSOS } from './slice';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, PieChart, Pie } from 'recharts';
import { dateFormatter } from '../../utils';
import { endpointTask } from '../../settings';

import './style.css';
import { get } from '../slice';

const formatValue = (value) => value.toFixed(0);

function Component() {
    // task
    const [range, setRange] = useState('daily');
    const [pieData, setPieData] = useState([]);
    const [taskData, setTaskData] = useState({});

    
    const { sosData } = useSelector(state => state.dashboard);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSOS( range));
    }, [dispatch,  range]);

    useEffect(() => {
        dispatch(get(endpointTask + '/admin/sa/statistics',  res => {
            setPieData(res.data.data.ticket_by_category);
            setTaskData(res.data.data);
        }));
    }, [dispatch]);

    return (
        <>
            <div className="box-self mb-4 pb-5">
                <div className="row mb-5">
                    <div className="col">
                        <div className="row justify-content-between">
                            <div className="col">
                                <h5>SOS Statistics</h5>
                            </div>
                            <div className="col-auto">
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <div
                                        className={range === 'daily' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('daily') }
                                    >
                                        DTD
                                    </div>
                                    <div
                                        className={range === 'monthly' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('monthly')}
                                    >
                                        MTD
                                    </div>
                                    <div
                                        className={range === 'annual' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('annual')}
                                    >
                                        YTD
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <AreaChart
                            width={730}
                            height={250}
                            data={sosData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0
                            }}
                        >
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
                </div>
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
                    // paddingBottom: 16,
                    marginRight: 0
                }}>
                    <div className="d-flex flex-column pb-3 mr-3 flex-wrap" style={{
                        flex: 1,
                    }}>
                        <AnimatedNumber
                            className="BigNumber in-dashboard text-weight-bold"
                            value={taskData.total_task}
                            formatValue={formatValue}
                        />
                        <span className="text-muted">Total Task</span>
                    </div>
                    <div className="d-flex flex-column pb-3 mr-3 flex-wrap" style={{
                        flex: 1
                    }}>
                        <AnimatedNumber
                            className="BigNumber in-dashboard text-weight-bold"
                            value={taskData.total_unresolved_task}
                            formatValue={formatValue}
                        />
                        <span className="text-muted">Unresolved Task</span>
                    </div>
                    <div className="d-flex flex-column pb-3 mr-3 flex-wrap" style={{
                        flex: 1
                    }}>
                        <AnimatedNumber
                            className="BigNumber in-dashboard text-weight-bold"
                            value={taskData.total_resolved_task}
                            formatValue={formatValue}
                        />
                        <span className="text-muted">Resolved Task</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component;