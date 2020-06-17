import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { get, toMoney } from '../../utils';
import { endpointBilling, endpointManagement, endpointMerchant, endpointTransaction } from '../../settings';

import './style.css';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, PieChart, Pie, ComposedChart } from 'recharts';

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
    const [trxData, setTrxData] = useState([]);
    const [range, setRange] = useState('ytd');
    const [scale, setScale] = useState('monthly');

    const [trxSumm, setTrxSumm] = useState({});

    const [successData, setSuccessData] = useState([]);
    const [successType, setSuccessType] = useState('year');

    const [failedData, setFailedData] = useState([]);
    const [failedType, setFailedType] = useState('year');

    const [merchantInfo, setMerchantInfo] = useState({});

    const [orderData, setOrderData] = useState([]);
    const [orderType, setOrderType] = useState('year');

    const headers = useSelector(state => state.auth.headers);

    useEffect(() => {
        get(endpointMerchant + '/admin/statistic/transactiongraph?type=' + range + '&scale='
            + scale,
            headers, res => {
                setTrxData(res.data.data.graph);
            })
    }, [headers, range, scale]);

    useEffect(() => {
        get(endpointTransaction + '/admin/transaction/summary',
            headers, res => {
                setTrxSumm(res.data.data);
            })
    }, [headers]);

    useEffect(() => {
        get(endpointMerchant + '/admin/statistic/successcategory?order_type=' + successType,
            headers, res => {
                setSuccessData(res.data.data);
            })
    }, [headers, successType]);

    useEffect(() => {
        get(endpointMerchant + '/admin/statistic/failedcategory?order_type=' + failedType,
            headers, res => {
                setFailedData(res.data.data);
            })
    }, [headers, failedType]);

    useEffect(() => {
        get(endpointMerchant + '/admin/statistics',
            headers, res => {
                setMerchantInfo(res.data.data);
            })
    }, [headers]);

    useEffect(() => {
        get(endpointMerchant + '/admin/statistic/mostordered?order_type=' + orderType +
            '&limit=5&page=1',
            headers, res => {
                setOrderData(res.data.data.items);
            })
    }, [headers, orderType]);

    return (
        <>
            <div className="Row">
                <div className="Container" style={{
                    flex: 3,
                    flexDirection: 'column',
                }}>
                    <h5>Transaction Statistics</h5>
                    {/* {JSON.stringify(trxData)} */}
                    <ComposedChart width={730} height={250} data={trxData}
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
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" dataKey="value_1"
                            tickFormatter={el => el && toMoney((el + '').slice(0, -3)).slice(3) + 'k'} />
                        <YAxis yAxisId="right" dataKey="value_2" orientation="right" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="value_1" stroke="#8884d8"
                            fillOpacity={1} fill="url(#colorUv)" yAxisId="left" />
                        <Area type="monotone" dataKey="value_2" stroke="#82ca9d"
                            fillOpacity={1} fill="url(#colorPv)" yAxisId="right" />
                    </ComposedChart>
                </div>
                <div className="Container" style={{
                    marginLeft: 16,
                    flexDirection: 'column',
                }}>
                    <h5>Transaction Summary</h5>
                    {/* {JSON.stringify(trxSumm)} */}
                    <div>Orders {trxSumm.total_transaction_count}</div>
                    <div>Amount {toMoney(trxSumm.total_transaction_amount)}</div>
                    <div>Settled {toMoney(trxSumm.total_settled_transaction_amount)}</div>
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
                    marginLeft: 16,
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div className="Row">
                        <div className="Container" style={{
                            flexDirection: 'column',
                        }}>
                            <h5>Total Merchant</h5>
                            {merchantInfo.total_merchant}
                        </div>
                        <div className="Container" style={{
                            flexDirection: 'column',
                        }}>
                            <h5>Active Merchant</h5>
                            {merchantInfo.active_merchant}
                        </div>
                        <div className="Container" style={{
                            flexDirection: 'column',
                        }}>
                            <h5>Inactive Merchant</h5>
                            {merchantInfo.inactive_merchant}
                        </div>
                    </div>
                    <div className="Container" style={{
                        justifyContent: 'space-between',
                    }}>
                        <h5>Outstanding Orders</h5>
                        {merchantInfo.outstanding_orders}
                        {/* {JSON.stringify(merchantInfo)} */}
                    </div>
                </div>
                <div className="Container" style={{
                    marginLeft: 16,
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