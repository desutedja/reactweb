import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { get } from '../../features/slice';
import { endpointAds } from '../../settings';
import './style.css';
import { toSentenceCase } from '../../utils';
import { setSelected } from '../../features/slices/staff';


function AdsCell({ id, compact=false }) {
    const [data, setData] = useState({
        content_name: '',
        appear_as: '',
    });

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointAds + '/management/ads/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <div className={ !compact ? "Item" : "Item-compact" } onClick={() => {
            history.push({
                pathname: 'advertisement/' + id,
                state: data
            });
            dispatch(setSelected(data));
        }}>
            { !compact &&
            <>
            <span> </span>
            <div >
                <b>{data.content_name}</b>
                <p className="Item-subtext">{toSentenceCase(data.appear_as)}</p>
            </div>
            </> }
        </div>
    );
}

export default AdsCell;
