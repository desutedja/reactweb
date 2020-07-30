import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getTaskDetails } from '../../features/slices/task';

function Component({ items, id, data }) {
    let dispatch = useDispatch();

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
