import React, { useEffect, useState } from 'react';
import { 
    // useSelector,
    useDispatch
} from 'react-redux';
import AnimatedNumber from "animated-number-react";
import moment from 'moment';

import { RiHomeSmile2Line, RiHomeLine, RiStore2Line } from 'react-icons/ri'
import { toMoney, getDatesRange } from '../../utils';
import { endpointMerchant, endpointTransaction } from '../../settings';

import './style.css';
import { Line, Legend, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ComposedChart, ResponsiveContainer } from 'recharts';
import { get } from '../slice';

// const formatValue = (value) => value.toFixed(0);
// const formatValuetoMoney = (value) => toMoney(value.toFixed(0));
const formatValue = (value) => value.toFixed(0);

function Component() {
    const [trxData, setTrxData] = useState([]);
    const [trxDataFormatted, setTrxDataFormatted] = useState([]);

    const [
        range,
        setRange
    ] = useState('mtd');

    const [trxSumm, setTrxSumm] = useState({});

    const [successData, setSuccessData] = useState([]);
    const [
        successType,
        // setSuccessType
    ] = useState('year');

    const [failedData, setFailedData] = useState([]);
    const [
        failedType,
        // setFailedType
    ] = useState('year');

    const [merchantInfo, setMerchantInfo] = useState({});

    const [orderData, setOrderData] = useState([]);
    const [
        orderType,
        // setOrderType
    ] = useState('year');

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/statistic/transactiongraph?range=' + range,
            res => {   
                setTrxData(res.data.data.graph);
            }))
    }, [dispatch, range]);

    useEffect(() => {
        dispatch(get(endpointTransaction + '/admin/transaction/summary',
             res => {
                setTrxSumm(res.data.data);
            }))
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/statistic/successcategory?order_type=' + successType,
             res => {
                setSuccessData(res.data.data);
            }))
    }, [dispatch, successType]);

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/statistic/failedcategory?order_type=' + failedType,
             res => {
                setFailedData(res.data.data);
            }))
    }, [dispatch, failedType]);

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/statistics',
             res => {
                setMerchantInfo(res.data.data);
            }))
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/statistic/mostordered?order_type=' + orderType +
            '&limit=5&page=1',
             res => {
                setOrderData(res.data.data.items);
            }))
    }, [dispatch, orderType]);

    useEffect(() => {
        if (range === 'dtd') {
            const aDaysBefore  = new Date().setHours(new Date().getHours() - 24);
            const hoursRange = getDatesRange(new Date(aDaysBefore), new Date(), 'hours');
            const trxDatas = hoursRange.map(date => {
                const data = trxData ? trxData.filter(data => data.date.split(' ')[0] + data.date.split(' ')[1].split(':')[0] === date.split(' ')[0] + date.split(' ')[1].split(':')[0]) : [];
                const day = moment(data.length > 0 ? data.date : date).format('dddd');
                const hour = moment(data.length > 0 ? data.date : date).format('HH:00');
                return ({
                    'Date': `${day.substring(0, 3)} ${hour}`,
                    'Amount Transaction': data.reduce((total, data) => {
                        return total + data.value_1
                    }, 0),
                    'Total Transaction': data.reduce((total, data) => {
                        return total + data.value_2
                    }, 0)
                })
            });
            setTrxDataFormatted(trxDatas)
        }

        if (range === 'mtd') {
            const aMonthBefore  = new Date().setDate(new Date().getDate() - 30);
            const datesRange = getDatesRange(new Date(aMonthBefore), new Date(), 'days')
            const trxDatas = datesRange.map((date, i) => {
                const data = trxData.filter(data => data.date.split(' ')[0] === date.split(' ')[0]);
                let month = moment(data.length > 0 ? data.date : date).format('MMM') + ' ';
                const d = moment(data.length > 0 ? data.date : date).format('DD');
                if (trxData) {
                    if (!(datesRange[i].split('-')[1] !== (datesRange[i - 1] ? datesRange[i - 1].split('-')[1] : datesRange[i - 1]))) month = '';
                }
                return ({
                    'Date': month + d,
                    'Amount Transaction': data.reduce((total, data) => {
                        return total + data.value_1
                    }, 0),
                    'Total Transaction': data.reduce((total, data) => {
                        return total + data.value_2
                    }, 0)
                })
            });
            setTrxDataFormatted(trxDatas)
        }

        if (range === 'ytd') {
            const aYearBefore  = new Date().setFullYear(new Date().getFullYear() - 1);
            const monthsRange = getDatesRange(new Date(aYearBefore), new Date(), 'months');
            const trxDatas = monthsRange.map(date => {
                const data = trxData ? trxData.filter(data => data.date.split(' ')[0].split('-')[0] + data.date.split(' ')[0].split('-')[1] === date.split(' ')[0].split('-')[0] + date.split(' ')[0].split('-')[1]) : [];
                const month = moment(data.length > 0 ? data.date : date).format('MMMM') + ' ';
                const year = moment(data.length > 0 ? data.date: date).format('YYYY')
                return ({
                    'Date': month + year,
                    'Amount Transaction': data.reduce((total, data) => {
                        return total + data.value_1
                    }, 0),
                    'Total Transaction': data.reduce((total, data) => {
                        return total + data.value_2
                    }, 0)
                })
            })
            setTrxDataFormatted(trxDatas)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trxData])

    return (
        <>
            <div className="row no-gutters">
                <div className="col">
                    <div className="Container color-4 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    value={merchantInfo.active_merchant}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Active Merchant</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiHomeSmile2Line className="BigIcon white my-0" />
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
                                    value={merchantInfo.inactive_merchant}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Inactive Merchant</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiHomeLine className="BigIcon white my-0" />
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
                                    value={merchantInfo.total_merchant}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Total Merchant</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiStore2Line className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-12">
                    <div className="Container flex-column pb-5 pr-4">
                        <div className="row mb-5 justify-content-between">
                            <div className="col">
                                <h5>Transaction Statistics</h5>
                            </div>
                            <div className="col-auto">
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <div
                                        className={range === 'dtd' ? "GroupActive color-5" : "Group"}
                                        onClick={() => setRange('dtd') }
                                    >
                                        DTD
                                    </div>
                                    <div
                                        className={range === 'mtd' ? "GroupActive color-5" : "Group"}
                                        onClick={() => setRange('mtd')}
                                    >
                                        MTD
                                    </div>
                                    <div
                                        className={range === 'ytd' ? "GroupActive color-5" : "Group"}
                                        onClick={() => setRange('ytd')}
                                    >
                                        YTD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col px-4" style={{
                                height: '360px'
                            }}>
                                <ResponsiveContainer width='100%'>
                                    <ComposedChart data={trxDataFormatted}>
                                        <XAxis height={50} dy={10} dataKey="Date" />
                                        <YAxis axisLine={false} tickLine={false} width={50} dx={-10} dataKey="Total Transaction" />
                                        <YAxis axisLine={false} yAxisId="right" width={60} dx={-10} dataKey="Amount Transaction"
                                        tickFormatter={el => el && toMoney((el + '').slice(0, -3)).slice(3) + 'k'}/>
                                        <Tooltip />
                                        <Legend />
                                        <CartesianGrid vertical={false} stroke="#ddd" dataKey="Date" />
                                        <Bar radius={4} dataKey="Amount Transaction" fill="#004e92" 
                                        yAxisId="right" maxBarSize={70}
                                        />
                                        <Line type="monotone" dataKey="Total Transaction" stroke="#ff7300"/>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                
                            </div>
                            <div className="col">

                            </div>
                            <div className="col">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="Row">
                <div className="Container" style={{
                    marginRight: 0,
                    flexDirection: 'column',
                }}>
                    <h5 className="mb-3">Transaction Summary</h5>
                    {/* {JSON.stringify(trxSumm)} */}
                    <div className="mb-2">Orders {trxSumm.total_transaction_count}</div>
                    <div className="mb-2">Amount {toMoney(trxSumm.total_transaction_amount)}</div>
                    <div className="mb-2">Settled {toMoney(trxSumm.total_settled_transaction_amount)}</div>
                    <div>Unsettled {toMoney(trxSumm.total_unsettled_transaction_amount)}</div>
                </div>
            </div>
            <div className="Row">
                <div className="Container" style={{
                    flexDirection: 'column',
                }}>
                    {/* {JSON.stringify(successData)} */}
                    <h5>Most Successful Order Category</h5>
                    <PieChart width={400} height={250}>
                        <Tooltip />
                        <Pie data={successData} dataKey="qty" nameKey="category"
                            cx="50%" cy="50%" outerRadius={50} fill="#8884d8" label />
                    </PieChart>
                </div>
                <div className="Container" style={{
                    marginRight: 0,
                    flexDirection: 'column',
                }}>
                    <h5>Most Failed Order Category</h5>
                    {/* {JSON.stringify(failedData)} */}
                    <PieChart width={400} height={250}>
                        <Tooltip />
                        <Pie data={failedData} dataKey="qty" nameKey="category"
                            cx="50%" cy="50%" outerRadius={50} fill="#8884d8" label />
                    </PieChart>
                </div>
            </div>
            <div className="Row">
                <div className="d-flex flex-column">
                    <div className="Container" style={{
                        justifyContent: 'space-between',
                    }}>
                        <h5>Outstanding Orders</h5>
                        {merchantInfo.outstanding_orders}
                        {/* {JSON.stringify(merchantInfo)} */}
                    </div>
                </div>
                <div className="Container" style={{
                    marginRight: 0,
                    flexDirection: 'column',
                }}>
                    <h5>Most Ordered Items</h5>
                    {/* {JSON.stringify(orderData)} */}
                    {orderData.map(el => <div key={el.id}>
                        {el.name} {el.qty}
                    </div>)}
                </div>
            </div>
        </>
    )
}

export default Component;