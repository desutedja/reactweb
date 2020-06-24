import React, { useEffect, useState } from 'react';

import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Legend, Bar } from 'recharts';
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
        }))
    }, [dispatch]);

    return (
        <>
            <div className="Container">
                <BarChart width={1000} height={600} data={adsData}
                    layout='vertical'
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type='number' />
                    <YAxis type='category' dataKey="content_name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_click" fill="#8884d8" />
                    <Bar dataKey="total_view" fill="#82ca9d" />
                </BarChart>
            </div>
        </>
    )
}

export default Component;