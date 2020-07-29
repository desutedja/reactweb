import React from 'react';

import Table from '../../../../components/Table';
import { useSelector } from 'react-redux';
import { toMoney, 
    // toSentenceCase 
} from '../../../../utils';

const columnsProduct = [
    { Header: 'Name', accessor: 'item_name' },
    /*   { Header: 'Type', accessor: row => toSentenceCase(row.item_type) }, */
    /* { Header: 'Base Price', accessor: row => toMoney(row.base_price) }, */
    { Header: 'Quantity', accessor: 'qty' },
    /* { Header: 'Admin Fee', accessor: row => toMoney(row.admin_fee) }, */
    /* { Header: 'Discount Code', accessor: row => row.discount_code ? row.discount_code : '-' }, */
    /* { Header: 'Discount Fee', accessor: row => row.discount_price + '%' }, */
    /* { Header: 'PG Fee', accessor: row => row.pg_fee + '%' }, */
    /* { Header: 'Selling Price', accessor: row => toMoney(row.selling_price) }, */
    { Header: 'Total Price', accessor: row => toMoney(row.total_price) },
]

function Component() {
    const { selected, loading } = useSelector(state => state.transaction);

    return (
        <Table
            noaction
            nopaging
            columns={columnsProduct}
            data={selected.items}
            loading={loading}
            pageCount={1}
        />
    )
}

export default Component;
