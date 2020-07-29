import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { post, get } from '../slice';
import { endpointBilling } from '../../settings';

function Component() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState('');
    const [pageCount, setPageCount] = useState('');

    const { unit } = useSelector(state => state.billing);
    let { trx_code } = useParams();
    let dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        dispatch(get(endpointBilling + '/management/billing/trx?trx=' +
            trx_code, res => {
                setData(res.data.data);
                setLoading(false);
            }))
    }, [dispatch, trx_code])
    
    return <div>{
        data ? data : "no data"
    }</div>
}

export default Component;

