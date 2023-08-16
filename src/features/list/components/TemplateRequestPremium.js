import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Table from "../../../components/Table";
// import Container from '../../../components/Container';
import Breadcrumb from "../../../components/Breadcrumb";

import { setConfirmDelete, put, setInfo } from "../../slice";
import Input from "../../../components/Input";
import Modal from "../../../components/Modal";
import { endpointResident } from "../../../settings";
import { toSentenceCase } from "../../../utils";
import { refresh } from "../../slices/requestpremium";

function Component({
  view = false,
  columns,
  slice,
  title = "",
  getAction,
  filterVars = [],
  actionDownloads= [],
  filters = [],
  actions = [],
  approved_status,
  approvedAction,
  disapprovedAction,
  sortBy,
  pagetitle,
  withSelection = false,
  filterExpanded = false,
  ...props
}) {
  const { loading, items, total_items, total_pages, refreshToggle } =
    useSelector((state) => state[slice]);

  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [datas, setDatas] = useState([]);

  let dispatch = useDispatch();

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <div className="Container">
        <Modal
          isOpen={openModal}
          toggle={() => {
            setOpenModal(false);
          }}
          title="Approve basic user"
          subtitle="Are you sure to Approve this User to Premium User?"
          okLabel={"Submit"}
          onClick={() => {
            dispatch(
              put(
                endpointResident + "/management/resident/upgrade_user",
                {
                  approved_status: "approved",
                  id: datas.id,
                  resident_id: parseInt(datas.resident_id),
                  period_from: from,
                  period_to: to,
                },
                (res) => {
                  console.log(res.data.data.items);
                  dispatch(
                    setInfo({
                      color: "success",
                      message: "Upgrade Basic User has been Approved.",
                    })
                  );
                },
                (err) => {
                  dispatch(
                    setInfo({
                      color: "error",
                      message: `Approved process error.`,
                    })
                  );
                  console.log("error");
                }
              )
            );
            setOpenModal(false);
            dispatch(refresh());
          }}
        >
          <label>
            <b>Status</b>
          </label>
          <br />
          {toSentenceCase(datas.status)}

          {datas.status === "own" ? null : (
            <>
              <Input
                label="Period From"
                type="date"
                inputValue={from}
                setInputValue={setFrom}
              />

              <Input
                label="Period To"
                type="date"
                inputValue={to}
                setInputValue={setTo}
              />
            </>
          )}
        </Modal>
        <Table
          filterExpanded={filterExpanded}
          totalItems={total_items}
          columns={columns}
          data={items}
          loading={loading}
          pageCount={total_pages}
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
          actionDownloads={view ? null : actionDownloads}
          onClickApproved={
            view
              ? null
              : approvedAction
              ? (row) => {
                  setOpenModal(true);
                  setDatas(row);
                  // dispatch(setConfirmDelete(
                  // <>
                  //     <div style={{ borderBottom: "1px solid #E9E9E9", marginBottom: 10, paddingBottom: 10}}>
                  //         Are you sure to Approve this item?
                  //     </div>
                  //     <div className='column'>
                  //         <div>
                  //             Status
                  //         </div>
                  //         <div>
                  //             <strong>{row.status}</strong>
                  //         </div>
                  //         {row.status === "own" ? null :
                  //         <form>
                  //             <Input
                  //                 label="Period From"
                  //                 type="date"
                  //                 inputValue={from}
                  //                 setInputValue={setFrom}
                  //             />
                  //             <Input
                  //                 label="Period To"
                  //                 type="date"
                  //                 inputValue={to}
                  //                 setInputValue={setTo}
                  //             />
                  //         </form>}
                  //     </div>
                  // </>,
                  //     () => dispatch(approvedAction(row, from, to))
                  // ));
                }
              : null
          }
          onClickDisapproved={
            view
              ? null
              : disapprovedAction
              ? (row) => {
                  dispatch(
                    setConfirmDelete(
                      "Are you sure to Disapprove this item?",
                      () => dispatch(disapprovedAction(row))
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
