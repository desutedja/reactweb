import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Component({ items, id, data }) {

    const { role } = useSelector(state => state.auth);

    return <Link to={"/" + role + "/task/" + id} style={{ display: "block" }} className="Item">
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </Link>
}

export default Component;
