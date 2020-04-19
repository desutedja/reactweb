import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { get } from '../../utils';
import { endpoint } from '../../settings';
import Table from '../../components/Table';
import Button from '../../components/Button';

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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const token = useSelector(state => state.auth.user.token);

    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        setLoading(true);

        get(endpoint + '/building' +
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

                setLoading(false);
            },
        )
    }, []);

    return (
        <Table columns={columns} data={data} loading={loading}
            actions={[
                <Button label="Add" icon={<FiPlus />}
                    onClick={() => history.push(url + "/add")}
                />
            ]}
        />
    )
}

export default Component;