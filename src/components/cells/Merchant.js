import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSelected } from '../../features/slices/merchant';

function Component({ items, id, data }) {
    let dispatch = useDispatch();
    let history = useHistory();

    return <div style={{ display: "block" }} className="Item" onClick={() => {
            history.push({
                pathname: 'merchant/' + id,
                state: data
            });
            dispatch(setSelected(data));
        }}>
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </div>
}

export default Component;
