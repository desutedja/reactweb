import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTransactionDetails } from '../../features/slices/transaction';

function Transaction({ items, id }) {
    let dispatch = useDispatch();
    let history = useHistory();

    return <div style={{ display: "block" }} className="Item" onClick={() => {
            dispatch(getTransactionDetails(id, history))
        }}>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </div>
}

export default Transaction;
