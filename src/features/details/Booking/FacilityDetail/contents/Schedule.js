import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Table from "../../../../../components/Table";
import Modal from "../../../../../components/Modal";
import Form from "../../../../../components/Form";
import Input from "../../../../../components/Input";
import { getAdsSchedule, editAdsSchedule } from "../../../../slices/ads";
import { days } from "../../../../../utils";

const columns = [
  { Header: "Day", accessor: (row) => row.day },
  { Header: "Open Time", accessor: (row) => row.open_time },
  { Header: "Closed Time", accessor: (row) => row.close_time },
  { Header: "Duration", accessor: (row) => row.duration },
  { Header: "Quota Per Duration", accessor: (row) => row.quota_per_duration },
];

function Component({ view, schedule }) {
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [none, setNone] = useState(false);

  // const { selected, loading, schedule, refreshToggle } = useSelector(
  //   (state) => state.ads
  // );
  const { user } = useSelector((state) => state.auth);
  const { group } = user;

  let dispatch = useDispatch();

  // const fetchData = useCallback(
  //   (pageIndex, pageSize, search) => {
  //     dispatch(getAdsSchedule(pageIndex, pageSize, search, selected));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   },
  //   [dispatch, refreshToggle]
  // );

  return (
    <div>
      <Modal isOpen={edit} disableFooter={true} toggle={() => setEdit(false)}>
        Edit Schedule
        <Form
          noContainer={true}
          onSubmit={(data) => {
            if (allDay) {
              data.hour_from = "00:00:00";
              data.hour_to = "23:59:59";
            }
            // dispatch(editAdsSchedule({ ...data, id: editing.int }));
            console.log("ID===========" + editing.id)
            setEdit(false);
            setAllDay(false);
          }}
        >
          {/* <input type="checkbox" class="form-check-input" id="all-day"
                        onChange={e => setAllDay(e.target.checked)} />
                    <label class="form-check-label m-0 cursor-pointer" for="all-day"><strong>All Day</strong></label> */}
          <Input
            disabled={allDay || none}
            label="Hour From"
            type="time"
            inputValue={
              allDay ? "00:00:00" : none ? "00:00:00" : editing.hour_from
            }
          />
          <Input
            disabled={allDay || none}
            label="Hour To"
            type="time"
            inputValue={
              allDay ? "23:59:59" : none ? "00:00:00" : editing.hour_to
            }
          />
          <div
            style={{
              display: "flex",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              style={{
                marginRight: 16,
              }}
              onClick={() => {
                setAllDay(!allDay);
              }}
            >
              {allDay ? "Disable" : "Set"} All Day
            </button>
            <button
              type="button"
              style={{
                marginRight: 16,
              }}
              onClick={() => {
                setNone(!none);
              }}
            >
              {none ? "Disable" : "Set"} None
            </button>
          </div>
        </Form>
      </Modal>
      <Table
        noContainer={true}
        columns={columns}
        data={schedule}
        pageCount={1}
        // fetchData={fetchData}
        filters={[]}
        onClickEdit={
          view
            ? null
            : group === "vas_advertiser"
            ? null
            : (row) => {
                setEditing(row);
                setEdit(true);
              }
        }
      />
    </div>
  );
}

export default Component;
