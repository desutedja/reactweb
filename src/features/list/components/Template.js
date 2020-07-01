import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../../components/Table';
import Container from '../../../components/Container';
import Breadcrumb from '../../../components/Breadcrumb';

import { setConfirmDelete } from '../../slice';

function Component({ columns, slice, getAction, filterVars = [], filters = [],
    actions = [], deleteAction, ...props }) {

    const { loading, items, total_pages, total_items, refreshToggle } =
        useSelector(state => state[slice]);

    let dispatch = useDispatch();

    return (
        <>
            <Breadcrumb />
            <Container>
                <Table totalItems={total_items}
                    columns={columns}
                    data={items}
                    loading={loading}
                    pageCount={total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        dispatch(getAction(pageIndex, pageSize, search, ...filterVars));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, ...filterVars])}
                    filters={filters}
                    actions={actions}
                    onClickDelete={deleteAction ? row => {
                        dispatch(setConfirmDelete("Are you sure to delete this item?",
                            () => dispatch(deleteAction(row))
                        ));
                    } : null}
                    {...props}
                />
            </Container>
        </>
    )
}

export default Component;