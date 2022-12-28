import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import TableWithSelectionAndDateBilling from "../../../components/TableWithSelectionAndDateBilling";
// import Container from '../../../components/Container';
import Breadcrumb from "../../../components/Breadcrumb";
// import Button from '../../../components/Button';

import { setConfirmDelete } from "../../slice";

function Component({
  view = false,
  columns,
  slice,
  startDate,
  title = "",
  getAction,
  filterVars = [],
  filters = [],
  selectAction,
  actions = [],
  actionDownloads = [],
  deleteAction,
  sortBy,
  pagetitle,
  ...props
}) {
  const { loading, items, total_items, total_pages, refreshToggle } =
    useSelector((state) => state[slice]);

  let dispatch = useDispatch();

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <div className="Container">
        <TableWithSelectionAndDateBilling
          onSelection={(selectedRows) => {
            selectAction(selectedRows);
          }}
          totalItems={total_items}
          columns={columns}
          data={items}
          loading={loading}
          pageCount={total_pages}
          fetchData={useCallback(
            (
              pageIndex,
              pageSize,
              search,
              startDate,
              endDate,
              sortField,
              sortType
            ) => {
              sortBy
                ? dispatch(
                    getAction(
                      pageIndex,
                      pageSize,
                      search,
                      startDate,
                      endDate,
                      sortField,
                      sortType,
                      ...filterVars
                    )
                  )
                : dispatch(
                    getAction(
                      pageIndex,
                      pageSize,
                      search,
                      startDate,
                      endDate,
                      ...filterVars
                    )
                  );
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },
            [dispatch, refreshToggle, ...filterVars]
          )}
          filters={filters}
          sortBy={sortBy}
          actions={view ? null : actions}
          actionDownloads={view ? null : actionDownloads}
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
