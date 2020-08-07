import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getBillingUnitItemDetails } from '../../features/slices/billing';

function BillingItem({ items, id }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const { role } = useSelector(state => state.auth);

    return <a style={{ display: "block" }} className="Item" href={"/" + role + "/billing/unit/item/details/" + id }>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </a>
}

export default BillingItem;
