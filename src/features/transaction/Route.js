import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Add from './Add';
import Details from './Details';
import { getTransaction, getTransactionDetails, setSelected } from './slice';
import { toMoney, toSentenceCase } from '../../utils';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Trx Code', accessor: 'trx_code' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    { Header: 'Merchant', accessor: 'merchant_name' },
    { Header: 'Resident', accessor: 'resident_name' },
    // { Header: 'Selling Price', accessor: 'total_selling_price' },
    // { Header: 'Internal Courier Fee', accessor: 'courier_internal_charges' },
    // { Header: 'External Courier Fee', accessor: 'courier_external_charges' },
    // { Header: 'Tax', accessor: 'tax_price' },
    // { Header: 'Discount', accessor: 'discount_price' },
    // { Header: 'Sales Fee', accessor: 'profit_from_sales' },
    // { Header: 'PG Fee', accessor: 'profit_from_pg' },
    // { Header: 'Delivery Fee', accessor: 'profit_from_delivery' },
    { Header: 'Total Price', accessor: row => toMoney(row.total_price) },
    { Header: 'Payment Date', accessor: row => row.payment_date ? row.payment_date : 'Unpaid' },
    //{ Header: 'Settlement Date', accessor: row => row.payment_settled_date ? row.payment_settled_date : '-' },
    //{ Header: 'Merchant Disbursement Date', accessor: row => row.disbursement_date ? row.disbursement_date : '-' },
    //{ Header: 'Courier Disbursement Date', accessor: row => row.courier_disbursement_date ? row.courier_disbursement_date : '-' },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, alert } = useSelector(state => state.transaction);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTransaction(headers, pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers])}
                        filters={[]}
                        actions={[]}
                        onClickDetails={row => dispatch(getTransactionDetails(row, headers, history, url))}
                        onClickChat={row => {
                            dispatch(setSelected(row));
                            history.push("/chat");
                        }}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
