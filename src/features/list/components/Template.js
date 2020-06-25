import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../../components/Table';
import Container from '../../../components/Container';

import { setConfirmDelete } from '../../slice';

function Component({ columns, slice, getAction, filterVars = [], filters = [],
    actions = [], deleteAction }) {

    const { loading, items, total_pages, total_items, refreshToggle } =
        useSelector(state => state[slice]);

    let dispatch = useDispatch();

    return (
        <Container>
            <Table totalItems={total_items}
                columns={columns}
                data={items}
                loading={loading}
                pageCount={total_pages}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getAction(pageIndex, pageSize, search, ...filters));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle, ...filters])}
                filters={filters}
                actions={actions}
                onClickDelete={row => {
                    dispatch(setConfirmDelete("Are you sure to delete this resident?",
                        () => dispatch(deleteAction(row))
                    ));
                }}
            />
        </Container>
    )
}

export default Component;
