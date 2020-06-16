import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Legend, Bar } from 'recharts';
import { get } from '../../utils';
import { endpointAds } from '../../settings';

import './style.css';

function Component() {
    const [adsData, setAdsData] = useState([]);

    const headers = useSelector(state => state.auth.headers);

    useEffect(() => {
        get(endpointAds + '/management/ads/report/overview', headers, res => {
            setAdsData(res.data.data);
        })
    }, [headers]);

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