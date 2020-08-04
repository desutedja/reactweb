import React, { useEffect, useState } from 'react';
import { 
    useSelector,
    useDispatch
} from 'react-redux';
import AnimatedNumber from "animated-number-react";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import ClinkLoader from '../../components/ClinkLoader';

import { RiHomeSmile2Line, RiHomeLine, RiStore2Line } from 'react-icons/ri'
import { toMoney, getDatesRange } from '../../utils';
import { endpointMerchant, endpointTransaction } from '../../settings';

import './style.css';
import { Line, Cell, Legend, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart,
    Pie, ComposedChart, ResponsiveContainer, LabelList } from 'recharts';
import { get } from '../slice';

const colorsSuccess = ['#577590', '#43aa8b', '#90be6d', '#f9c74f'];
const colorsFailed = ['#9a031e', '#f3722c', '#f8961e', '#f9c74f'];
// const formatValue = (value) => value.toFixed(0);
// const formatValuetoMoney = (value) => toMoney(value.toFixed(0));
const formatValue = (value) => value.toFixed(0);

function Component() {
    const history = useHistory();
    let dispatch = useDispatch();

    const { auth } = useSelector(state => state);
    const [cats, setCats] = useState([]);
    const [trxData, setTrxData] = useState([]);
    const [trxDataFormatted, setTrxDataFormatted] = useState([]);

    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/categories',
        res => {
            const data = res.data.data;
            const formatted = data.map(el => ({label: el.name, value: el.id}))
            setCats(formatted);
        }))
    }, [dispatch])

    useEffect(() => {
        setLoading(true);
        dispatch(get(endpointMerchant + '/admin/statistic/transactiongraph?range=' + range,
            res => {
                setLoading(false);
                setTrxData(res.data.data.graph);
                console.log(res.data.data)
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
                // console.log(res.data.data)
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
                const day = moment(date).format('dddd');
                const hour = moment(date).format('HH:00');
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
                const data = trxData ? trxData.filter(data => data.date.split(' ')[0] === date.split(' ')[0]) : [];
                let month = moment(date).format('MMM') + ' ';
                const d = moment(date).format('D');
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
                const month = moment(date).format('MMM') + ' ';
                const year = moment(date).format('YYYY')
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
    }, [range, trxData]);

    const transactionsSummary = [
        { header: 'Orders', accessor: trxSumm.total_transaction_count },
        { header: 'Amount', accessor: toMoney(trxSumm.total_transaction_amount) },
        { header: 'Settled', accessor: toMoney(trxSumm.total_settled_transaction_amount) },
        { header: 'Unsettled', accessor: toMoney(trxSumm.total_unsettled_transaction_amount) },
        { header: 'Undisbursed', accessor: toMoney(
            trxSumm.total_courier_undisbursed_transaction_amount +
            trxSumm.total_merchant_undisbursed_transaction_amount
        ) },
    ]

    return (
        <>
            <div className="row no-gutters">
                <div className="col-9">
                    <div className="Container color-2 d-flex flex-column cursor-pointer"
                    onClick={() => {
                        history.push('/' + auth.role + '/transaction/list');
                    }}
                    >
                        <div className="row no-gutters align-items-center py-2">
                            <div className="col">
                                <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    value={merchantInfo.outstanding_orders}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Outstanding Orders</div>
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
                    <div className="Container d-flex flex-column cursor-pointer"
                    onClick={() => {
                        history.push('/' + auth.role + '/merchant');
                    }}
                    >
                        <div className="d-flex justify-content-between mb-2">
                            <div>
                                Active Merchant
                            </div>
                            <div>
                                <AnimatedNumber
                                    className="BigNumber blue"
                                    value={merchantInfo.active_merchant}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <div>
                                Inactive Merchant
                            </div>
                            <div>
                                <AnimatedNumber
                                    className="BigNumber blue"
                                    value={merchantInfo.inactive_merchant}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>
                                Total Merchant
                            </div>
                            <div>
                                <AnimatedNumber
                                    className="BigNumber blue"
                                    value={merchantInfo.total_merchant}
                                    formatValue={formatValue}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-12">
                    <div className="Container flex-column pr-4">
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
                        <div className="row pb-3">
                            <div className="col px-4" style={{
                                height: '360px',
                                position: 'relative'
                            }}>
                            {loading && <div style={{
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
                                    <ComposedChart data={trxDataFormatted}>
                                        <XAxis dy={10} height={50} dataKey="Date" />
                                        <YAxis orientation="right"
                                            width={90} dx={10} dataKey="Total Transaction"
                                        />
                                        <YAxis yAxisId="right" width={90}
                                            dx={-10} dataKey="Amount Transaction"
                                            tickFormatter={el => el && el.toString().length > 3 ?
                                                (el + '').slice(0, -3) + 'k' : el}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <CartesianGrid vertical={false} stroke="#ddd" dataKey="Date" />
                                        <Bar radius={4} dataKey="Amount Transaction" fill="#004e92" 
                                        yAxisId="right" maxBarSize={70} className="cursor-pointer"
                                        onClick={() => {
                                            history.push('/' + auth.role + '/transaction/list');
                                        }}
                                        />
                                        <Line type="monotone" dataKey="Total Transaction" stroke="#ff7300" className="cursor-pointer"
                                        onClick={() => {
                                            history.push('/' + auth.role + '/transaction/list');
                                        }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col">
                    <div className="Container flex-column">
                        <div className="row">
                            <div className="col">
                                <h5>Most Successful Order Category</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={{
                                height: '280px'
                            }}>
                                <ResponsiveContainer className="mt-5" width='100%'>
                                    <PieChart>
                                        <Pie data={successData} dataKey="qty"
                                        cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                                        fill="#8884d8" label  nameKey="category" labelLine={false}
                                        onClick={(el) => {
                                            const clicked = cats.find(item => item.label === el.name);
                                            if (clicked) history.push('/' + auth.role + '/product', {cat: clicked.value, catName: clicked.label})
                                        }}
                                        >
                                            { successData.map((entry, i) => <Cell className="cursor-pointer" key={`cell-${i}`} fill={colorsSuccess[i]}/>) }
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
                                    {successData.map((data, i) => (
                                        <>
                                        <li className="text-capitalize py-1 col-6 cursor-pointer"
                                        onClick={() => {
                                            const clicked = cats.find(item => item.label === data.category);
                                            if (clicked) history.push('/' + auth.role + '/product', {cat: clicked.value, catName: clicked.label})
                                        }}
                                        >
                                            <svg height="14" width="14" >
                                                <circle cx="7" cy="7" r="7" fill={colorsSuccess[i]} />
                                            </svg>
                                            <span className="ml-3 h6">{data.category}</span>
                                        </li>
                                        </>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="Container flex-column">
                        <div className="row">
                            <div className="col">
                                <h5>Most Failed Order Category</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={{
                                height: '280px'
                            }}>
                                <ResponsiveContainer className="mt-5" width='100%'>
                                    <PieChart>
                                        <Pie data={failedData} dataKey="qty" nameKey="category"
                                        cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                                        fill="#8884d8" label labelLine={false}
                                        onClick={(el) => {
                                            const clicked = cats.find(item => item.label === el.name);
                                            if (clicked) history.push('/' + auth.role + '/product', {cat: clicked.value, catName: clicked.label})
                                        }}
                                        >
                                            { failedData.map((entry, i) => <Cell className="cursor-pointer" fill={colorsFailed[i]}/>) }
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
                                    {failedData.map((data, i) => (
                                        <>
                                        <li className="text-capitalize py-1 col-6 cursor-pointer"
                                        onClick={() => {
                                            const clicked = cats.find(item => item.label === data.category);
                                            if (clicked) history.push('/' + auth.role + '/product', {cat: clicked.value, catName: clicked.label})
                                        }}
                                        >
                                            <svg height="14" width="14" >
                                                <circle cx="7" cy="7" r="7" fill={colorsFailed[i]} />
                                            </svg>
                                            <span className="ml-3 h6">{data.category}</span>
                                        </li>
                                        </>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="row">
                        <div className="col">
                            <div className="Container cursor-pointer" style={{
                            marginRight: 0,
                            flexDirection: 'column',
                            }}
                            onClick={() => {
                                history.push('/' + auth.role + '/transaction/disbursement');
                            }}
                            >
                                <div className="row">
                                    <div className="col">
                                        <h5 className="mb-4">Transaction Summary</h5>
                                    </div>
                                </div>
                                {transactionsSummary.map((row, i) => (
                                <div key={i} className="row py-2">
                                    <div className="col">
                                        <span>{row.header}</span>
                                    </div>
                                    <div className="col-auto BigNumber blue">
                                        <span>{row.accessor}</span>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="Container" style={{
                                marginRight: 0,
                                flexDirection: 'column',
                            }}>
                                <div className="row">
                                    <div className="col">
                                        <h5 className="mb-4">Most Ordered Items</h5>
                                    </div>
                                </div>
                                {orderData.map((el, i) => 
                                <>
                                    <div key={el.item_id} className="row">
                                        <div className="col-auto">
                                            <div style={{
                                                width: '7px',
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold'
                                            }}>#{i + 1}</div>
                                        </div>
                                        <div className="col d-flex align-items-center">
                                            <div className="bread"
                                            onClick={() => {
                                                history.push('/' + auth.role + '/product/' + el.item_id)
                                            }}
                                            >{el.name}</div>
                                        </div>
                                        <div className="col-auto BigNumber blue">
                                            {el.qty}
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component;