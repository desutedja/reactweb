import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../../components/Table';
// import Container from '../../../components/Container';
import Breadcrumb from '../../../components/Breadcrumb';

import { setConfirmDelete } from '../../slice';

function Component({ view = false, columns, slice, title = '', getAction, filterVars = [],
    filters = [], actions = [], approved_status,approvedAction,disapprovedAction, sortBy, pagetitle, withSelection = false, filterExpanded = false,...props }) {

    const {
        loading,
        items,
        total_items,
        total_pages,
        refreshToggle
    } = useSelector(state => state[slice]);

    const [inputFrom, setInputFrom] = useState();
    const [inputTo, setInputTo] = useState();

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
                    onClickApproved={view ? null : approvedAction ? row => {
                        dispatch(setConfirmDelete(
                        <>
                            <div style={{ borderBottom: "1px solid #E9E9E9", marginBottom: 10, paddingBottom: 10}}>
                                Are you sure to Approve this item?
                            </div>
                            <div className='column'>
                                <div>
                                    Status
                                </div>
                                <div>
                                    <strong>{row.status}</strong>
                                </div>
                                {row.status === "own" ? null :
                                <> 
                                <label>Period From
                                    <input className='form-control' type="date" value={inputFrom} onChange={setInputFrom} />
                                </label>
                                <label>Period To
                                    <input className='form-control' type="date" value={inputTo} onChange={setInputTo}  />
                                </label>
                                </>}
                            </div>
                        </>,
                            () => dispatch(approvedAction(row, inputFrom, inputTo))
                        ));
                    } : null}
                    onClickDisapproved={view ? null : disapprovedAction ? row => {
                        dispatch(setConfirmDelete("Are you sure to Disapprove this item?",
                            () => dispatch(disapprovedAction(row))
                        ));
                    } : null}
                    {...props}
                />
            </div>
        </>
    )
}

export default Component;
