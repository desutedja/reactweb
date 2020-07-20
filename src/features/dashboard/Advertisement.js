import React, { useEffect, useState } from 'react';

import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Legend, Bar } from 'recharts';
import { endpointAds } from '../../settings';

import './style.css';
import { get } from '../slice';
import { useDispatch } from 'react-redux';

function Component() {
    const [adsData, setAdsData] = useState([]);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(get(endpointAds + '/management/ads/report/overview',  res => {
            setAdsData(res.data.data);
            console.log(res.data.data)
        }))
    }, [dispatch]);

    return (
        <>
            <div className="row no-gutters">
                <div className="col-6">
                    <div className="Container flex-column pb-5 pr-4">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5>Views Statistics</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"
                                style={{
                                    height: 500
                                }}
                            >
                                <ResponsiveContainer width='100%'>
                                    <BarChart
                                        data={adsData}
                                        layout={'vertical'}
                                    >
                                        <CartesianGrid vertical={false} stroke="#ddd" />
                                        <XAxis height={40} type='number' dy={10}/>
                                        <YAxis width={120} type='category' dx={-10} dataKey="content_name"/>
                                        <Tooltip />
                                        <Legend />
                                        <Bar radius={4} dataKey="total_actual_click" fill="#f7b733" />
                                        <Bar radius={4} dataKey="total_actual_view" fill="#2ad170" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component;