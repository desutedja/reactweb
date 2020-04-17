import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { get } from '../../utils';
import { url } from '../../settings';
import Table from '../../components/Table';

const columns = [
    { Header: 'id', accessor: 'id' },
    { Header: 'name', accessor: 'name' },
    { Header: 'legal_name', accessor: 'legal_name' },
    { Header: 'owner_name', accessor: 'owner_name' },
    { Header: 'code_name', accessor: 'code_name' },
    { Header: 'phone', accessor: 'phone' },
    { Header: 'email', accessor: 'email' },
    { Header: 'website', accessor: 'website' },
    { Header: 'address', accessor: 'address' },
    { Header: 'district', accessor: 'district' },
    { Header: 'city', accessor: 'city' },
    { Header: 'province', accessor: 'province' },
    { Header: 'zipcode', accessor: 'zipcode' },
    { Header: 'max_units', accessor: 'max_units' },
    { Header: 'max_floors', accessor: 'max_floors' },
    { Header: 'max_sections', accessor: 'max_sections' },
    { Header: 'lat', accessor: 'lat' },
    { Header: 'long', accessor: 'long' },
    { Header: 'logo', accessor: 'logo' },
]

function Component() {
    const [data, setData] = useState([]);

    const token = useSelector(state => state.auth.user.token);

    useEffect(() => {
        get(url + '/building' +
            '?page=' +
            '&limit=' +
            '&search=' +
            '&province=' +
            '&city=' +
            '&district=',
            {
                Authorization: "Bearer " + token
            },
            res => {
                setData(res.data.data.items);
            },
        )
    }, []);

    return (
        <Table columns={columns} data={data} />
    )
}

export default Component;