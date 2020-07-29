import React, {  } from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import { toSentenceCase } from '../../utils';

function AdsCell({ id, data, compact=false }) {

    return (
        <Link to={'advertisement/' + id} className={ !compact ? "Item" : "Item-compact" }>
            { !compact &&
            <>
            <span> </span>
            <div >
                <b>{data.content_name}</b>
                <p className="Item-subtext">{toSentenceCase(data.appear_as)}</p>
            </div>
            </> }
        </Link>
    );
}

export default AdsCell;
