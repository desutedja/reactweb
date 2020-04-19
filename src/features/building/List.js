import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { get } from '../../utils';
import { endpoint } from '../../settings';
import Table from '../../components/Table';
import Button from '../../components/Button';

const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner Name', accessor: 'owner_name' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Website', accessor: 'website' },
    { Header: 'Location', accessor: row => row.lat + ', ' + row.long  },
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
                <Button key="Add" label="Add" icon={<FiPlus />}
                    onClick={() => history.push(url + "/add")}
                />
            ]}
        />
    )
}

export default Component;