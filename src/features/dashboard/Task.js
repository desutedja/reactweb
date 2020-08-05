import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AnimatedNumber from "animated-number-react";
import ClinkLoader from '../../components/ClinkLoader';

import { RiTaskLine, RiFileExcelLine, RiFileChartLine } from 'react-icons/ri';

import { getSOS } from './slice';
import { 
    Bar,
    Line,
    // Area,
    XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, ComposedChart, 
    // AreaChart
} from 'recharts';
import { getDatesRange, months } from '../../utils';
import { endpointTask } from '../../settings';

import moment from 'moment';

import './style.css';
import { get } from '../slice';

const formatValue = (value) => value.toFixed(0);

const colors = ['#2ad170', '#007bff', '#f7b733', '#ed4057'];

function Component() {
    const history = useHistory();
    const { sosData } = useSelector(state => state.dashboard);
    const { auth, dashboard } = useSelector(state => state);
    
    const [range, setRange] = useState('ytd');
    const [pieData, setPieData] = useState([]);
    const [taskData, setTaskData] = useState({});
    const [sosDataFormatted, setSosDataFormatted] = useState()

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSOS(range));
    }, [dispatch, range]);

    useEffect(() => {
        if (auth.role === 'sa') {
            dispatch(get(endpointTask + '/admin/sa/statistics',  res => {
                setPieData(res.data.data.ticket_by_category);
                setTaskData(res.data.data);
            }));
        }
        if (auth.role === 'bm') {
            dispatch(get(endpointTask + '/admin/pic_bm/statistics',  res => {
                setPieData(res.data.data.ticket_by_category);
                setTaskData(res.data.data);
                console.log(res.data.data);
            }));
        }
    }, [auth.role, dispatch]);

    useEffect(() => {
        if (range === 'dtd') {
            const aDaysBefore  = new Date().setHours(new Date().getHours() - 24);
            const hoursRange = getDatesRange(new Date(aDaysBefore), new Date(), 'hours');
            const sosDatas = hoursRange.map(date => {
                const data = sosData.filter(data => data.time.split('T')[0] + data.time.split('T')[1].split(':')[0] === date.split(' ')[0] + date.split(' ')[1].split(':')[0]);
                return ({
                    time: date,
                    num_of_sos: data.reduce((total, data) => {
                        return total + data.num_of_sos
                    }, 0)
                })
            })
            const sosDataFormatted = sosDatas.map((data, i) => {
                let day = moment(data.time).format('dddd');
                const hour = moment(data.time).format('HH:00');
                return (
                    {
                        SOS: data.num_of_sos,
                        Time: `${day.substring(0, 3)} ${hour}`,
                        index: i
                    }
                )
            })
            setSosDataFormatted(sosDataFormatted)
        }

        if (range === 'mtd') {
            const aMonthBefore  = new Date().setDate(new Date().getDate() - 30);
            const datesRange = getDatesRange(new Date(aMonthBefore), new Date(), 'days')
            const sosDatas = datesRange.map(date => {
                const data = sosData.filter(data => data.time.split('T')[0] === date.split(' ')[0])
                return ({
                    time: data[0] ? data[0].time.split('T')[0] : date.split(' ')[0],
                    num_of_sos: data.reduce((total, data) => {
                        return total + data.num_of_sos
                    }, 0)
                })
            })
            const sosDataFormatted = sosDatas.map((data, i) => {
                let month = months[data.time.split('-')[1] - 1].label;
                if (!(sosDatas[i].time.split('-')[1] !== (sosDatas[i - 1] ? sosDatas[i - 1].time.split('-')[1] : sosDatas[i - 1]))) month = '';
                const date = data.time.split('-')[2];
                return (
                    {
                        SOS: data.num_of_sos,
                        Time: `${month.substring(0, 3)} ${date}`,
                        index: i
                    }
                )
            })
            setSosDataFormatted(sosDataFormatted)
        }

        if (range === 'ytd') {
            const aYearBefore  = new Date().setFullYear(new Date().getFullYear() - 1);
            const monthsRange = getDatesRange(new Date(aYearBefore), new Date(), 'months');
            const sosDatas = monthsRange.map(date => {
                const data = sosData.filter(data => data.time.split('T')[0].split('-')[0] + data.time.split('T')[0].split('-')[1] === date.split(' ')[0].split('-')[0] + date.split(' ')[0].split('-')[1]);
                return ({
                    time: data[0] ? data[0].time.split('T')[0] : date,
                    num_of_sos: data.reduce((total, data) => {
                        return total + data.num_of_sos
                    }, 0)
                })
            })
            const sosDataFormatted = sosDatas.map((data, i) => {
                let month = months[data.time.split('-')[1] - 1].label;
                return (
                    {
                        SOS: data.num_of_sos,
                        Time: `${month.substring(0, 3)} ${data.time.split('-')[0]}`,
                        index: i
                    }
                )
            })
            setSosDataFormatted(sosDataFormatted)
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sosData]);

    return (
        <>
            <div className="row no-gutters">
                <div className="col">
                    <div className="Container color-4 d-flex flex-column cursor-pointer"
                    onClick={() => {
                        history.push('/' + auth.role + '/task', {status: 'completed', statusLabel: 'Completed'})
                    }}
                    >
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
                    <div className="Container color-3 d-flex flex-column cursor-pointer"
                    onClick={() => {
                        history.push('/' + auth.role + '/task', {status: 'unresolved', statusLabel: 'Unresolved'})
                    }}
                    >
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
                    <div className="Container color-5 d-flex flex-column cursor-pointer"
                    onClick={() => {
                        history.push('/' + auth.role + '/task')
                    }}
                    >
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
                            <div className="col px-4" style={{
                                height: '390px',
                                position: 'relative'
                            }}>
                            {dashboard.loading && <div style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(255, 255, 255, .8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: '1'
                            }}>
                                <ClinkLoader />
                            </div>}
                                <ResponsiveContainer width='100%'>
                                    <ComposedChart data={sosDataFormatted}>
                                        <XAxis height={30} dy={10} dataKey="Time" />
                                        <YAxis axisLine={false} tickLine={false} width={40} dx={-10} dataKey="SOS" />
                                        <Tooltip />
                                        <CartesianGrid vertical={false} stroke="#ddd" dataKey="Time" />
                                        <Bar className="cursor-pointer" onClick={() => {history.push('/' + auth.role + '/task')}} radius={4} dataKey="SOS" fill="rgb(237, 64, 87)" maxBarSize={80} />
                                    </ComposedChart>
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
                                        <Pie className="cursor-pointer" onClick={(el) => {
                                            el.name === 'security' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Security', type: 'security' }) :
                                            el.name === 'delivery' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Delivery', type: 'delivery' }) :
                                            el.name === 'service' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Service', type: 'service' }) :
                                                history.push('/' + auth.role + '/task', { typeLabel: '', type: ''})
                                        }} data={pieData} dataKey="num_of_task" nameKey="task_type"
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
                                        <li className="text-capitalize py-1 col-6 cursor-pointer" onClick={(el) => {
                                            data.task_type === 'security' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Security', type: 'security' }) :
                                            data.task_type === 'delivery' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Delivery', type: 'delivery' }) :
                                            data.task_type === 'service' ?
                                                history.push('/' + auth.role + '/task', { typeLabel: 'Service', type: 'service' }) :
                                                history.push('/' + auth.role + '/task', { typeLabel: '', type: ''})
                                        }} >
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
            {auth.role === 'bm' && <div className="row no-gutters">
                <div className="col">
                    <div className="Container flex-column">
                        <div className="row mb-2">
                            <div className="col">
                                <h5>Most Resolver This Month</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <ul className="list-stats">
                                {taskData.task_resolver_last_month && taskData.task_resolver_this_month.map((resolver, i) => (
                                    <li className="row no-gutters align-items-center">
                                        <div className="col-auto">
                                            <div style={{
                                                width: '40px',
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold'
                                            }}>#{i + 1}</div>
                                        </div>
                                        <div className="col">
                                            <div><b>{resolver.firstname + ' ' + resolver.lastname}</b></div>
                                            <div className="text-capitalize">{resolver.staff_role.replace('_', ' ')}</div>
                                        </div>
                                        <div className="col-auto BigNumber">
                                            {resolver.resolved_task}
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="Container flex-column">
                        <div className="row mb-2">
                            <div className="col">
                                <h5>Most Resolver Last Month</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <ul className="list-stats">
                                {taskData.task_resolver_this_month && taskData.task_resolver_last_month.map((resolver, i) => (
                                    <li className="row no-gutters">
                                        <div className="col-auto">
                                            <div style={{
                                                width: '40px',
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold'
                                            }}>#{i + 1}</div>
                                        </div>
                                        <div className="col">
                                            <div><b>{resolver.firstname + ' ' + resolver.lastname}</b></div>
                                            <div className="text-capitalize">{resolver.staff_role.replace('_', ' ')}</div>
                                        </div>
                                        <div className="col-auto BigNumber black">
                                            {resolver.resolved_task}
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Component;