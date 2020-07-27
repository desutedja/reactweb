import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link} from 'react-router-dom';
import { getTransactionDetails } from '../../features/slices/transaction';

function Transaction({ items, trxcode }) {
    let dispatch = useDispatch();
    let history = useHistory();

    const { role } = useSelector(state => state.auth);

    return <Link to={"/" + role + "/transaction/" + trxcode} style={{ display: "block" }} className="Item" onClick={() => {
            dispatch(getTransactionDetails(trxcode, history))
        }}>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </Link>
}

export default Transaction;
