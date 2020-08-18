import React from 'react';
import { useSelector } from 'react-redux';

function BillingItem({ items, unitid, id }) {

    const { role } = useSelector(state => state.auth);

    //return <a style={{ display: "block" }} className="Item" href={"/" + role + "/billing/unit/item/details/" + id }>
    return <a style={{ display: "block" }} className="Item" href={"/" + role + "/billing/unit/"+ unitid + "/" + id }>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </a>
}

export default BillingItem;
