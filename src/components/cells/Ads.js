import React, {  } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './style.css';
import { toSentenceCase } from '../../utils';
import { setSelected } from '../../features/slices/ads';


function AdsCell({ id, data, compact=false }) {
    let dispatch = useDispatch();
    let history = useHistory();

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
