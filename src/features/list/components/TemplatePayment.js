import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Table from "../../../components/Table";
// import Container from '../../../components/Container';
import Breadcrumb from "../../../components/Breadcrumb";

import { setConfirmDelete } from "../../slice";

function Component({
  view = false,
  columns,
  slice,
  title = "",
  getAction,
  filterVars = [],
  filters = [],
  actions = [],
  deleteAction,
  sortBy,
  pagetitle,
  withSelection = false,
  filterExpanded = false,
  ...props
}) {
  const { loading, items, refreshToggle } = useSelector(
    (state) => state[slice]
  );

  let dispatch = useDispatch();

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <div className="Container">
        <Table
          filterExpanded={filterExpanded}
          columns={columns}
          data={items}
          loading={loading}
          fetchData={useCallback(
            (pageIndex, pageSize, search, sortField, sortType) => {
              sortBy
                ? dispatch(
                    getAction(
                      pageIndex,
                      pageSize,
                      search,
                      sortField,
                      sortType,
                      ...filterVars
                    )
                  )
                : dispatch(
                    getAction(pageIndex, pageSize, search, ...filterVars)
                  );
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },
            [dispatch, refreshToggle, ...filterVars]
          )}
          filters={filters}
          sortBy={sortBy}
          actions={view ? null : actions}
          onClickDelete={
            view
              ? null
              : deleteAction
              ? (row) => {
                  dispatch(
                    setConfirmDelete("Are you sure to delete this item?", () =>
                      dispatch(deleteAction(row))
                    )
                  );
                }
              : null
          }
          {...props}
        />
      </div>
    </>
  );
}

export default Component;
