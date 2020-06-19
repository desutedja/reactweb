import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Filter from '../../components/Filter';
import Details from './Details';
import Settlement from './Settlement';
import Disbursement from './Disbursement';
import { getTransaction, getTransactionDetails, setSelected } from './slice';
import { toMoney, toSentenceCase, dateTimeFormatter } from '../../utils';
import { Badge } from 'reactstrap';
import { trxStatusColor } from '../../settings';

const columns = [
    // { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    { Header: 'Merchant', accessor: 'merchant_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    { Header: 'Payment Amount', accessor: row => toMoney(row.payment_amount) },
    {
        Header: 'Transaction Date', accessor: row => dateTimeFormatter(row.created_on)
    },
    {
        Header: 'Payment Date', accessor: row => row.payment_date ?
            dateTimeFormatter(row.payment_date) : 'Unpaid'
    },
    {
        Header: 'Status', accessor: row => row.status ?
            <h5><Badge pill color={trxStatusColor[row.status]}>
                {toSentenceCase(row.status)}
            </Badge></h5> : "-"
    },
]

const statuses = Object.keys(trxStatusColor);

function Component() {
    const [status, setStatus] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <   Redirect exact from={path} to={`${path}/list`} />
                <Route path={`${path}/list`}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransaction(headers, pageIndex, pageSize, search, status));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, status])}
                        filters={[
                            {
                                hidex: status === "",
                                label: <p>{"Status: " + toSentenceCase(status ? status : 'all')}</p>,
                                delete: () => { setStatus(""); },
                                component: (toggleModal) =>
                                    <Filter
                                        data={statuses}
                                        onClick={(el) => {
                                            setStatus(el);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setStatus("");
                                            toggleModal(false);
                                        }}
                                    />
                            },
                        ]}
                        actions={[]}
                        onClickDetails={row => dispatch(getTransactionDetails(row, headers, history, url))}
                        onClickChat={row => {
                            dispatch(setSelected(row));
                            history.push("/chat");
                        }}
                    />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
                <Route path={`${path}/settlement`}>
                    <Settlement />
                </Route>
                <Route path={`${path}/disbursement`}>
                    <Disbursement />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
