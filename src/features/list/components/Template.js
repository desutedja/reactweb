import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../../components/Table';
// import Container from '../../../components/Container';
import Breadcrumb from '../../../components/Breadcrumb';

import { setConfirmDelete } from '../../slice';

function Component({ view = false, columns, slice, title = '', getAction, filterVars = [],
    filters = [], actions = [], deleteAction, sortBy, pagetitle, withSelection = false, filterExpanded = false,...props }) {

    const {
        loading,
        items,
        total_items,
        total_pages,
        refreshToggle
    } = useSelector(state => state[slice]);

    let dispatch = useDispatch();

    return (
        <>
            <h2 style={{ marginLeft: '16px' }}>{pagetitle}</h2>
            <Breadcrumb title={title} />
            <div className="Container">
                <Table
                    filterExpanded={filterExpanded}
                    totalItems={total_items}
                    columns={columns}
                    data={items}
                    loading={loading}
                    pageCount={total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search, sortField, sortType) => {
                        sortBy ?
                            dispatch(getAction(pageIndex, pageSize, search, sortField, sortType, ...filterVars)) :
                            dispatch(getAction(pageIndex, pageSize, search, ...filterVars));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, ...filterVars])}
                    filters={filters}
                    sortBy={sortBy}
                    actions={view ? null : actions}
                    onClickDelete={view ? null : deleteAction ? row => {
                        dispatch(setConfirmDelete("Are you sure to delete this item?",
                            () => dispatch(deleteAction(row))
                        ));
                    } : null}
                    {...props}
                />
            </div>
        </>
    )
}

export default Component;
