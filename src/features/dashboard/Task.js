import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { getSOS } from './slice';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { dateFormatter } from '../../utils';
import { endpointTask } from '../../settings';

import './style.css';
import { get } from '../slice';

const formatValue = (value) => value.toFixed(0);

const colors = ['#2ad170', '#007bff', '#f7b733', '#ed4057'];

function Component() {
    // task
    const { sosData } = useSelector(state => state.dashboard);

    const [range, setRange] = useState('dtd');
    const [pieData, setPieData] = useState([]);
    const [taskData, setTaskData] = useState({});
    const [sosDataFormatted, setSosDataFormatted] = useState()

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSOS(range));
    }, [dispatch, range]);

    useEffect(() => {
        dispatch(get(endpointTask + '/admin/sa/statistics',  res => {
            setPieData(res.data.data.ticket_by_category);
            setTaskData(res.data.data);
        }));
    }, [dispatch]);

    useEffect(() => {
        const sosDataFormatted = sosData.map((data, i) => (
            {
                SOS: data.num_of_sos,
                Time: dateFormatter(data.time),
                index: i
            }
        ))
        sosDataFormatted.sort((a, b) => b.index - a.index)
        setSosDataFormatted(sosDataFormatted)
    }, [sosData]);

    return (
        <div style={{
            marginLeft: 16,
        }}>
            <div className="row no-gutters">
                <div className="col-12 col-md">
                    <div className="box-self mb-4 pb-5">
                        <div className="row mb-5 justify-content-between">
                            <div className="col">
                                <h5>SOS Statistics</h5>
                            </div>
                            <div className="col-auto">
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <div
                                        className={range === 'dtd' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('dtd') }
                                    >
                                        DTD
                                    </div>
                                    <div
                                        className={range === 'mtd' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('mtd')}
                                    >
                                        MTD
                                    </div>
                                    <div
                                        className={range === 'ytd' ? "GroupActive" : "Group"}
                                        onClick={() => setRange('ytd')}
                                    >
                                        YTD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col pr-5 pb-3" style={{
                                height: '390px'
                            }}>
                                <ResponsiveContainer width='100%'>
                                    <AreaChart
                                        // width={730}
                                        // height={250}
                                        data={sosDataFormatted}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="crimson" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="crimson" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="Time" dy={8}/>
                                        <YAxis dataKey="SOS" dx={-8}/>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="Time" stroke="crimson" fillOpacity={1} fill="url(#colorUv)" />
                                        <Area type="monotone" dataKey="SOS" stroke="crimson" fillOpacity={1} fill="url(#colorPv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-3 p-0 ml-0 ml-md-4">
                    <div className="box-self mb-4">
                        <div className="row">
                            <div className="col">
                                <h5>Task Categories</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={{
                                height: '300px'
                            }}>
                                <ResponsiveContainer className="mt-5" width='100%'>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="num_of_task" nameKey="task_type"
                                        cx="50%" cy="50%" innerRadius={85} outerRadius={120}
                                        fill="#8884d8" label >
                                        {
                                            pieData.map((entry, i) => <Cell fill={colors[i]}/>)
                                        }
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="border-bottom mt-5 pt-4 mx-auto"></div>
                        <div className="row mt-5">
                            <div className="col">
                                <ul className="row" style={{
                                    listStyle: 'none',
                                    padding: '0'
                                }}>
                                    {pieData.map((data, i) => (
                                        <>
                                        <li className="text-capitalize py-1 col-6">
                                            <svg height="12" width="12" >
                                                <circle cx="6" cy="6" r="6" fill={colors[i]} />
                                                Sorry, your browser does not support inline SVG.  
                                            </svg>
                                            <span className="ml-3 h6">{data.task_type}</span>
                                        </li>
                                        </>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col">
                    <div className="box-self mb-4">
                        <div className="row">
                            <div className="col d-flex flex-column pb-3 mr-3 flex-wrap">
                                <AnimatedNumber
                                    className="BigNumber in-dashboard text-weight-bold"
                                    value={taskData.total_task}
                                    formatValue={formatValue}
                                />
                                <span className="text-muted">Total Task</span>
                            </div>
                            <div className="col d-flex flex-column pb-3 mr-3 flex-wrap">
                                <AnimatedNumber
                                    className="BigNumber in-dashboard text-weight-bold"
                                    value={taskData.total_unresolved_task}
                                    formatValue={formatValue}
                                />
                                <span className="text-muted">Unresolved Task</span>
                            </div>
                            <div className="col d-flex flex-column pb-3 mr-3 flex-wrap">
                                <AnimatedNumber
                                    className="BigNumber in-dashboard text-weight-bold"
                                    value={taskData.total_resolved_task}
                                    formatValue={formatValue}
                                />
                                <span className="text-muted">Resolved Task</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Component;