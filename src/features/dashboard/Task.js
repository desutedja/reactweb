import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { RiTaskLine, RiFileExcelLine, RiFileChartLine } from 'react-icons/ri'

import { getSOS } from './slice';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
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
        <div>
            <div className="row no-gutters">
                <div className="col">
                    <div className="Container color-4 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    value={taskData.total_resolved_task}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Resolved Task</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiTaskLine className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="Container color-3 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    value={taskData.total_unresolved_task}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Unresolved Task</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiFileExcelLine className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="Container color-5 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    value={taskData.total_task}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Total Task</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiFileChartLine className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-12 col-md">
                    <div className="Container flex-column pb-5 pr-4">
                        <div className="row mb-5 justify-content-between">
                            <div className="col">
                                <h5>SOS Statistics</h5>
                            </div>
                            <div className="col-auto">
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <div
                                        className={range === 'dtd' ? "GroupActive color-3" : "Group"}
                                        onClick={() => setRange('dtd') }
                                    >
                                        DTD
                                    </div>
                                    <div
                                        className={range === 'mtd' ? "GroupActive color-3" : "Group"}
                                        onClick={() => setRange('mtd')}
                                    >
                                        MTD
                                    </div>
                                    <div
                                        className={range === 'ytd' ? "GroupActive color-3" : "Group"}
                                        onClick={() => setRange('ytd')}
                                    >
                                        YTD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col pl-0 pr-5" style={{
                                height: '390px'
                            }}>
                                <ResponsiveContainer width='100%'>
                                    <BarChart data={sosDataFormatted}>
                                        <XAxis dataKey="Time" />
                                        <YAxis dataKey="SOS" />
                                        <Tooltip />
                                        <CartesianGrid stroke="#ccc" dataKey="Time" strokeDasharray="5 8" />
                                        <Bar dataKey="SOS" fill="rgb(237, 64, 87)" barSize={50} />
                                    </BarChart>
                                    {/* <AreaChart
                                        data={sosDataFormatted}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0
                                        }}
                                    >
                                        <defs>
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
                                    </AreaChart> */}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-3 p-0">
                    <div className="Container flex-column">
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
                                        cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                                        fill="#8884d8" label>
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
                                            <svg height="14" width="14" >
                                                <circle cx="7" cy="7" r="7" fill={colors[i]} />
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
        </div>
    )
}

export default Component;