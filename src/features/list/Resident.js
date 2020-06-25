import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Container from '../../components/Container';

import Resident from '../../components/items/Resident';

import { Badge } from 'reactstrap';
import { getResident, setSelected, deleteResident } from '../resident/slice';
import { toSentenceCase } from '../../utils';
import { setConfirmDelete } from '../slice';

const columns = [
    {
        Header: "Resident",
        accessor: row => <Resident id={row.id} />,
    },
    {
        Header: "Email", accessor: row => <a target="_blank" rel="noopener noreferrer"
            href={'mailto:' + row.email}>{row.email}</a>
    },
    { Header: "Phone", accessor: "phone" },
    {
        Header: "Status", accessor: row => row.status ?
            <h5><Badge pill color="success">{toSentenceCase(row.status)}</Badge></h5>
            :
            <h5><Badge pill color="secondary">Inactive</Badge></h5>
    },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ?
            <h5><Badge pill color="primary">{toSentenceCase(row.status_kyc)}</Badge></h5>
            :
            <h5><Badge pill color="secondary">None</Badge></h5>
    },
]

function Component() {
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Container>
            <Table totalItems={total_items}
                columns={columns}
                data={items}
                loading={loading}
                pageCount={total_pages}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getResident(pageIndex, pageSize, search));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle])}
                filters={[]}
                actions={[
                    <Button key="Add Resident" label="Add Resident" icon={<FiPlus />}
                        onClick={() => {
                            dispatch(setSelected({}));
                            history.push(url + "/add");
                        }}
                    />
                ]}
                onClickDelete={row => {
                    dispatch(setConfirmDelete("Are you sure to delete this resident?",
                        () => dispatch(deleteResident(row))
                    ));
                }}
            />
        </Container>
    )
}

export default Component;
