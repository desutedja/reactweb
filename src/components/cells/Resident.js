import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { get } from '../../features/slice';
import { endpointResident } from '../../settings';
import './style.css';
import { setSelected } from '../../features/slices/resident';


function Component({ id, compact=false, onClick=null, onClickPath='' }) {
    const [data, setData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        photo: '',
    });

    let dispatch = useDispatch();
    let history = useHistory();
    let { path } = useRouteMatch();

    path = onClickPath !== '' ? onClickPath : path;

    const onClickAction = onClick ? onClick :  () => {
        history.push({
            pathname: path + '/' + id,
            state: data
        });
        dispatch(setSelected(data));
    }

    useEffect(() => {
        dispatch(get(endpointResident + '/management/resident/detail/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <div className={ !compact ? "Item" : "Item-compact" } onClick={(e) => onClickAction(e)}>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            { !compact &&
            <>
            <span> </span>
            <div >
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div> 
            </>
            }
        </div>
    );
}

export default Component;
