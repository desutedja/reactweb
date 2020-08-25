import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, LabelList } from 'recharts';
import { endpointAds } from '../../settings';

import './style.css';
import { get } from '../slice';
import { useDispatch } from 'react-redux';
import { toSentenceCase } from '../../utils';

const CustomLabelList = (props) => {
    const { x, y, stroke, value } = props;
    return (
        <text textAnchor="right" dy={20} dx={10} x={x} y={y} fill={stroke} >{value}</text>
    )
}

function Component() {
    const { auth } = useSelector(state => state);
    const role = auth.role;

    const [adsData, setAdsData] = useState([]);

    let dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(get(endpointAds + '/management/ads/report/overview', res => {
            setAdsData(res.data.data);
        }))
    }, [dispatch]);

    return (
        <>
            <div className="row no-gutters">
                <div className="col-6">
                    <div className="Container flex-column pb-5 pr-4">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5>View Statistics</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"
                                style={{
                                    height: 40 * adsData.length || 300
                                }}
                            >
                                <ResponsiveContainer width='100%'>
                                    <BarChart
                                        data={adsData}
                                        layout={'vertical'}
                                        onClick={props => {
                                            if (!props) return;
                                            const idAds = props.activePayload[0].payload.id
                                            history.push('/' + role + '/advertisement/' + idAds)
                                        }}
                                    >
                                        <XAxis height={40} hide type="number" dy={10} tickLine={false} axisLine={false} />
                                        <YAxis width={123}
                                            tickFormatter={category => toSentenceCase(category.length > 10 ? category.slice(0, 10) + '...' : category)}
                                            yAxisId="category" type='category' dx={-10} dataKey="content_name"
                                            tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Bar maxBarSize={30} yAxisId="category" radius={4} className="cursor-pointer"
                                            dataKey="total_actual_view" fill="#2ad170" onClick={({id}) => {
                                                history.push('/' + role + '/advertisement/' + id)
                                            }}
                                        >
                                            <LabelList dataKey="total_actual_view" stroke="white" position="insideRight"
                                                content={<CustomLabelList />} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="Container flex-column pb-5 pr-4">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5>Click Statistics</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"
                                style={{
                                    height: 40 * adsData.length || 300
                                }}
                            >
                                <ResponsiveContainer width='100%'>
                                    <BarChart
                                        data={adsData}
                                        layout={'vertical'}
                                        onClick={props => {
                                            if (!props) return;
                                            const idAds = props.activePayload[0].payload.id
                                            history.push('/' + role + '/advertisement/' + idAds)
                                        }}
                                    >
                                        <XAxis height={40} hide type="number" dy={10} tickLine={false} axisLine={false} />
                                        <YAxis width={123}
                                            tickFormatter={category => toSentenceCase(category.length > 10 ? category.slice(0, 10) + '...' : category)}
                                            yAxisId="category" type='category' dx={-10} dataKey="content_name"
                                            tickLine={false} axisLine={false}/>
                                        <Tooltip />
                                        <Bar
                                            maxBarSize={30} yAxisId="category" radius={4} className="cursor-pointer"
                                            dataKey="total_actual_click" fill="#f7b733" onClick={({id}) => {
                                                history.push('/' + role + '/advertisement/' + id)
                                            }}
                                        >
                                            <LabelList dataKey="total_actual_click" stroke="white" position="insideRight"
                                                content={<CustomLabelList />} />
                                        </Bar>
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