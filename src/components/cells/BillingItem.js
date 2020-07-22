import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getBillingUnitItemDetails } from '../../features/slices/billing';

function BillingItem({ items, data }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return <div style={{ display: "block" }} className="Item" onClick={() => {
            dispatch(getBillingUnitItemDetails(data, history, url))
        }}>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </div>
}

export default BillingItem;
