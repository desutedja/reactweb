import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiDownload, FiUpload, FiCheck } from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import CustomAlert from "../../components/CustomAlert";
import PillBilling from "../../components/PillBilling";
import { closeAlert } from "../slice";
import "react-confirm-alert/src/react-confirm-alert.css";

import Modal from "../../components/Modal";

import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
  getBillingUnit,
  downloadBillingUnit,
  downloadSetAsPaidBulk,
  setSelectedItem,
  setSelected,
  updateBillingPublish,
  updateSetAsPaidSelected,
  refresh,
  startAsync,
  stopAsync,
} from "../slices/billing";
import { endpointAdmin, endpointBilling, online_status } from "../../settings";
import {
  toSentenceCase,
  toMoney,
  inputDateTimeFormatter,
  inputDateTimeFormatter24,
} from "../../utils";
import { get, post, setInfo } from "../slice";

import TemplateWithSelectionAndDate from "./components/TemplateWithSelectionAndDate";
import UploadModal from "../../components/UploadModal";
import UploadModalV2 from "../../components/UploadModalV2";

function Component({ view }) {
  const [search, setSearch] = useState("");

  const { role, user } = useSelector((state) => state.auth);

  const [modalPublish, toggleModalPublish] = useState(false);
  const [openReleaseWithSchedule, setOpenReleaseWithSchedule] = useState(false);
  const [type, setType] = useState("now");
  const [selectWithImage, setSelectWithImage] = useState("n");
  const [schedule, setSchedule] = useState("");
  const handleShow = () => toggleModalPublish(true);
  const [buildingRelease, setBuildingRelease] = useState("");

  const [building, setBuilding] = useState(() => {
    const savedBuilding = localStorage.getItem("filter_building");
    const initialBuilding = savedBuilding;
    return initialBuilding || "";
  });
  const [buildingName, setBuildingName] = useState(() => {
    const savedBuildingLabel = localStorage.getItem("label_building");
    const initialBuildingLabel = savedBuildingLabel;
    return initialBuildingLabel || "";
  });

  const [buildings, setBuildings] = useState("");
  const [buildingList, setBuildingList] = useState("");
  const [released, setReleased] = useState(() => {
    const savedReleased = localStorage.getItem("filter_released");
    const initialReleased = savedReleased;
    return initialReleased || "";
  });
  const [multiActionRows, setMultiActionRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [alert, setAlert] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const fileInput = useRef();

  const [limit, setLimit] = useState(5);
  const [upload, setUpload] = useState(false);
  const [uploadSetAsPaid, setUploadSetAsPaid] = useState(false);

  const yearnow = new Date().getFullYear();
  const years = [];

  for (let i = yearnow - 1; i <= yearnow + 1; i++) {
    years.push({ value: i, label: i });
  }

  const [year, setYear] = useState(yearnow);

  const monthnow = new Date().getMonth();
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yesno = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  const [withImage, setWithImage] = useState("");

  const [month, setMonth] = useState(monthnow + 1);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    // storing input status
    localStorage.setItem("filter_building", building);
    localStorage.setItem("label_building", buildingName);
  }, [building, buildingName]);

  useEffect(() => {
    // storing input status
    localStorage.setItem("filter_released", released);
  }, [released]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/building" +
          "?limit=" +
          limit +
          "&page=1" +
          "&search=" +
          search,
        (res) => {
          let data = res.data.data.items;
          let totalItems = Number(res.data.data.total_items);
          let restTotal = totalItems - data.length;

          let formatted = data.map((el) => ({ label: el.name, value: el.id }));

          if (data.length < totalItems && search.length === 0) {
            formatted.push({
              label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
              restTotal: restTotal > 5 ? 5 : restTotal,
              className: "load-more",
            });
          }

          setBuildings(formatted);
        }
      )
    );
  }, [dispatch, search, limit]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.building_name,
            value: el.id,
          }));

          setBuildingList(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (role) {
      setColumns([
        // { Header: 'ID', accessor: 'code' },
        { Header: "ID", accessor: "id" },
        {
          Header: "Unit",
          accessor: (row) => (
            <span
              className="Link"
              onClick={() => {
                history.push("/" + role + "/billing/unit/" + row.id);
              }}
            >
              <b>
                {toSentenceCase(row.section_type) +
                  " " +
                  row.section_name +
                  " " +
                  row.number}
              </b>
              <br />
              <span>{row.building_name}</span>
            </span>
          ),
        },
        {
          Header: "Resident",
          accessor: (row) => (row.resident_name ? row.resident_name : "-"),
        },
        { Header: "Year", accessor: (row) => row.year },
        { Header: "Month", accessor: (row) => row.month },
        {
          Header: "Status",
          accessor: (row) => (
            <PillBilling
              color={
                row.status === "paid"
                  ? "success"
                  : row.status == "some paid"
                  ? "warning text-white"
                  : row.status == "unpaid"
                  ? "danger"
                  : ""
              }
            >
              {toSentenceCase(row.status)}
            </PillBilling>
          ),
        },
        {
          Header: "Total",
          accessor: (row) => <b>{toMoney(row.total)}</b>,
        },
        { Header: "Released", accessor: (row) => row.released },
        //{ Header: "With Image", accessor: (row) => row.with_image },
      ]);
    }
  }, [role]);

  useEffect(() => {
    if (search.length === 0) setLimit(5);
  }, [search]);

  function uploadResult(result) {
    return (
      <>
        <div>
          <h5>Total of {result.main_billings_total} billings was read</h5>
        </div>
        <hr />
        <ListGroup style={{ marginBottom: "20px" }}>
          <ListGroupItem color="success">
            {result.main_billings_success} billings successfully created.
          </ListGroupItem>
          <ListGroupItem color="danger">
            {result.main_billings_failed} billings failed to create.
          </ListGroupItem>
        </ListGroup>
        <ListGroup>
          <p>Showing up to 100 result: </p>
          {result.main_billings?.map((el, index) => {
            /* only show up to 10 rows */
            return (
              <>
                {index < 100 && (
                  <ListGroupItem
                    color={
                      !el.row_error && !el.column_error ? "success" : "danger"
                    }
                  >
                    {!el.row_error && !el.column_error ? (
                      <>
                        Row {el.row_number}: <b>{el.data?.name}</b> for unit ID{" "}
                        <b>{el.data?.resident_unit}</b> was created{" "}
                        <b>(ID: {el.data?.id})</b>.
                      </>
                    ) : (
                      <>
                        Row {el.row_number}:{" "}
                        {el.row_error && <>{el.row_error},</>}{" "}
                        {el.column_error &&
                          el.column_error.map(
                            (k) => k.column_name + " " + k.error_message
                          )}
                      </>
                    )}
                  </ListGroupItem>
                )}
              </>
            );
          })}
        </ListGroup>
        <div style={{ marginTop: "20px" }}>
          <h5>
            Total of {result.additional_charges_total} additional charges was
            read
          </h5>
        </div>
        <hr />
        <ListGroup style={{ marginBottom: "20px" }}>
          <ListGroupItem color="success">
            {result.additional_charges_success} additional charges successfully
            created.
          </ListGroupItem>
          <ListGroupItem color="danger">
            {result.additional_charges_failed} additional charges failed to
            create.
          </ListGroupItem>
        </ListGroup>
        <p>Showing up to 100 result: </p>
        {result.additional_charges?.map((el, index) => {
          /* only show up to 10 rows */
          return (
            <>
              {index < 100 && (
                <ListGroupItem
                  color={
                    !el.row_error && !el.column_error ? "success" : "danger"
                  }
                >
                  {!el.row_error && !el.column_error ? (
                    <>
                      Row {el.row_number}: <b>{el.data?.charge_name}</b> for
                      billing ID <b>{el.data?.billing_id}</b> was created.
                    </>
                  ) : (
                    <>
                      Row {el.row_number}:{" "}
                      {el.row_error && <>{el.row_error},</>}{" "}
                      {el.column_error &&
                        el.column_error.map(
                          (k) => k.column_name + " " + k.error_message
                        )}
                    </>
                  )}
                </ListGroupItem>
              )}
            </>
          );
        })}
      </>
    );
  }

  function uploadResultSetAsPaid(result) {
    return (
      <>
        {result.status == "Success" ? (
          <>
            <div>
              <h5>{result.message}</h5>
            </div>
          </>
        ) : (
          <>
            <div>
              <h5 class="red">{result.message}</h5>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={modalPublish}
        toggle={() => {
          toggleModalPublish(false);
        }}
        title="Publish All"
        okLabel={"Submit"}
        onClick={() => {
          dispatch(
            post(
              endpointBilling + "/management/billing/publish-billing-building",
              {
                building_id: buildingRelease,
                year: "" + year,
                month: "" + month,
                with_image: selectWithImage,
                published_date: inputDateTimeFormatter24(schedule),
              },
              (res) => {
                console.log(res.data.data);
                dispatch(
                  setInfo({
                    color: "success",
                    message: `${res.data.data} billing has been set to released.`,
                  })
                );
                // resultComponent ? setOpenRes(true) : toggle();
              },
              (err) => {
                dispatch(
                  setInfo({
                    color: "error",
                    message: `Error to released.`,
                  })
                );
                console.log("error");
              }
            )
          );

          dispatch(refresh());
          dispatch(stopAsync());
          toggleModalPublish(false);
        }}
      >
        <Input
          label="Building"
          inputValue={buildingRelease}
          type="select"
          options={buildingList}
          setInputValue={setBuildingRelease}
          title="Building List"
          hidden={role !== "sa"}
        />

        <Input
          label="Month"
          inputValue={month}
          type="select"
          options={months}
          setInputValue={setMonth}
          title="Month List"
        />

        <Input
          label="Year"
          inputValue={year}
          type="select"
          options={years}
          setInputValue={setYear}
          title="Year List"
        />

        <Input
          label="Choose Release Schedule"
          type="radio"
          name="release_type"
          options={[
            { value: "now", label: "Now" },
            { value: "other", label: "Other" },
          ]}
          inputValue={type}
          setInputValue={setType}
        />

        {type === "now" ? null : (
          <Input
            type="datetime-local"
            label="Schedule"
            name="published_date"
            inputValue={schedule}
            setInputValue={setSchedule}
          />
        )}

        <Input
          label="Release with image from catat meter?"
          type="radio"
          name="with_image"
          options={[
            { value: "y", label: "Yes" },
            { value: "n", label: "No" },
          ]}
          inputValue={selectWithImage}
          setInputValue={setSelectWithImage}
        />
      </Modal>

      <Modal
        isOpen={openReleaseWithSchedule}
        toggle={() => {
          setOpenReleaseWithSchedule(false);
        }}
        title="Release Billing"
        okLabel={"Yes, Submit"}
        onClick={() => {
          dispatch(startAsync());
          type !== "now"
            ? dispatch(
                post(
                  endpointBilling + "/management/billing/publish-billing",
                  {
                    data: multiActionRows,
                    with_image: selectWithImage,
                    published_date: inputDateTimeFormatter24(schedule),
                  },
                  (res) => {
                    console.log(res.data.data);
                    dispatch(
                      setInfo({
                        color: "success",
                        message: `${res.data.data} billing has been set to released.`,
                      })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                    dispatch(refresh());
                    dispatch(stopAsync());
                  },
                  (err) => {
                    dispatch(
                      setInfo({
                        color: "error",
                        message: `Error to released.`,
                      })
                    );
                    console.log("error");
                  }
                )
              )
            : dispatch(
                post(
                  endpointBilling + "/management/billing/publish-billing",
                  {
                    data: multiActionRows,
                    with_image: selectWithImage,
                  },
                  (res) => {
                    console.log(res.data.data);
                    dispatch(
                      setInfo({
                        color: "success",
                        message: `${res.data.data} billing has been set to released.`,
                      })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                    dispatch(refresh());
                    dispatch(stopAsync());
                  },
                  (err) => {
                    dispatch(
                      setInfo({
                        color: "error",
                        message: `Error to released.`,
                      })
                    );
                    console.log("error");
                  }
                )
              );

          setOpenReleaseWithSchedule(false);
        }}
      >
        <Input
          label="Choose Release Schedule"
          type="radio"
          name="release_type"
          options={[
            { value: "now", label: "Now" },
            { value: "other", label: "Other" },
          ]}
          inputValue={type}
          setInputValue={setType}
        />

        {type === "now" ? null : (
          <Input
            type="datetime-local"
            label="Schedule"
            name="published_date"
            inputValue={schedule}
            setInputValue={setSchedule}
          />
        )}

        <Input
          label="Release with image from catat meter?"
          type="radio"
          name="with_image"
          options={[
            { value: "y", label: "Yes" },
            { value: "n", label: "No" },
          ]}
          inputValue={selectWithImage}
          setInputValue={setSelectWithImage}
        />
      </Modal>

      <UploadModal
        open={upload}
        toggle={() => setUpload(false)}
        templateLink={user.billing_bulk_template}
        // templateLink={"https://api.yipy.id/yipy-assets/asset-storage/document/ABB45E5DDEC4AF95D0960C2EB88CFC57.xlsx"}
        filename="billing_unit_template.xlsx"
        uploadLink={endpointBilling + "/management/billing/upload"}
        uploadDataName="file_upload"
        resultComponent={uploadResult}
      />

      <UploadModalV2
        open={uploadSetAsPaid}
        toggle={() => setUploadSetAsPaid(false)}
        templateLink={
          "https://api.yipy.id/yipy-assets/asset-storage/document/8D23E9158CBE5501CFDBD34E4B132C54.xlsx"
        }
        filename="set_as_paid_template.xlsx"
        uploadLink={
          endpointBilling +
          "/management/billing/setaspaidbulk?building_id=" +
          building
        }
        uploadDataName="file_upload"
        resultComponent={uploadResultSetAsPaid}
      />

      <CustomAlert
        isOpen={alert}
        toggle={() => setAlert(false)}
        title={"Error"}
        subtitle={"Please Choose Building"}
        content={"You need to choose Building first"}
      />

      <TemplateWithSelectionAndDate
        view={view}
        columns={columns}
        slice="billing"
        getAction={getBillingUnit}
        selectAction={(selectedRows) => {
          const selectedRowIds = [];
          selectedRows.map((row) => {
            if (row !== undefined) {
              selectedRowIds.push({
                unit_id: row.id,
                month: row.month,
                year: row.year,
              });
            }
          });
          setMultiActionRows([...selectedRowIds]);
          console.log(selectedRowIds);
        }}
        filterVars={[building, released]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: (
                    <p>
                      Building: {building ? <b>{buildingName}</b> : <b>All</b>}
                    </p>
                  ),
                  delete: () => setBuilding(""),
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Building"
                        compact
                        icon={<FiSearch />}
                        inputValue={search}
                        setInputValue={setSearch}
                      />
                      <Filter
                        data={buildings}
                        onClick={(el) => {
                          if (!el.value) {
                            setLimit(limit + el.restTotal);
                            return;
                          }
                          setBuilding(el.value);
                          setBuildingName(el.label);
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                        onClickAll={() => {
                          setBuilding("");
                          setBuildingName("");
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                      />
                    </>
                  ),
                },
                {
                  hidex: released === "",
                  label: (
                    <p>
                      Released:
                      {released ? 
                        <b> {toSentenceCase(released)}</b>
                       : 
                        <b> All</b>
                      }
                    </p>
                  ),
                  delete: () => {
                    setReleased("");
                  },
                  component: (toggleModal) => (
                    <Filter
                      data={online_status}
                      onClickAll={() => {
                        setReleased("");
                        toggleModal(false);
                      }}
                      onClick={(el) => {
                        setReleased(el.value);
                        toggleModal(false);
                      }}
                    />
                  ),
                },
              ]
            : [
                {
                  hidex: released === "",
                  label: (
                    <p>
                      {released ? "Released: " + released : "Released: All"}
                    </p>
                  ),
                  delete: () => {
                    setReleased("");
                  },
                  component: (toggleModal) => (
                    <Filter
                      data={online_status}
                      onClickAll={() => {
                        setReleased("");
                        toggleModal(false);
                      }}
                      onClick={(el) => {
                        setReleased(el.value);
                        toggleModal(false);
                      }}
                    />
                  ),
                },
              ]
        }
        actionDownloads={
          view
            ? null
            : [
                <Button
                  color="Download"
                  label="Download Billing Units .csv"
                  icon={<FiDownload />}
                  onClick={() =>
                    dispatch(downloadBillingUnit(search, building))
                  }
                />,
              ]
        }
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <Button
                    color="Activated"
                    label="Upload Bulk"
                    icon={<FiUpload />}
                    onClick={() => setUpload(true)}
                  />,

                  <Button
                    color="Activated"
                    label="Upload Bulk Set As Paid"
                    icon={<FiUpload />}
                    onClick={() => {
                      if (role === "sa" && building == "") {
                        setAlert(true);
                        return;
                      }

                      setUploadSetAsPaid(true);
                    }}
                  />,

                  <Button label="Release All" onClick={handleShow} />,

                  <Button
                    color="Activated"
                    label="Release Selected"
                    disabled={Object.keys(selectedRowIds).length === 0}
                    onClick={() => {
                      setOpenReleaseWithSchedule(true);
                    }}
                  />,

                  <Button
                    color="Activated"
                    label="Set as Paid Selected"
                    disabled={Object.keys(selectedRowIds).length === 0}
                    icon={<FiCheck />}
                    onClick={() => {
                      confirmAlert({
                        title: "Set as Paid Billing",
                        message: "Do you want to set selected unit as Paid?",
                        buttons: [
                          {
                            label: "Yes",
                            onClick: () => {
                              dispatch(
                                updateSetAsPaidSelected(multiActionRows)
                              );
                            },
                            className: "Button btn btn-secondary",
                          },
                          {
                            label: "Cancel",
                            className: "Button btn btn-cancel",
                          },
                        ],
                      });
                    }}
                  />,
                ];
              }
        }
        onClickAddBilling={
          view
            ? null
            : (row) => {
                dispatch(setSelected(row));
                dispatch(setSelectedItem({}));
                history.push(url + "/" + row.id + "/add");
              }
        }
      />
    </>
  );
}
export default Component;
