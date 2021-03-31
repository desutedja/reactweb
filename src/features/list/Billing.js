import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiDownload, FiUpload } from "react-icons/fi";

import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
  getBillingUnit,
  downloadBillingUnit,
  setSelectedItem,
  setSelected,
  updateBillingPublish,
} from "../slices/billing";
import { endpointAdmin, endpointBilling } from "../../settings";
import { toSentenceCase, toMoney } from "../../utils";
import { get } from "../slice";

import TemplateWithSelection from "./components/TemplateWithSelection";
import UploadModal from "../../components/UploadModal";

function Component({ view }) {
  const [search, setSearch] = useState("");

  const { role, user } = useSelector((state) => state.auth);

  //   const { selectedRowIds } = useSelector((state) => state.billing);

  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");
  const [multiActionRows, setMultiActionRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [limit, setLimit] = useState(5);
  const [upload, setUpload] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

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
            </span>
          ),
        },
        {
          Header: "Building",
          accessor: (row) => (
            <a
              className="Link"
              href={"/" + role + "/building/" + row.building_id}
            >
              {row.building_name}
            </a>
          ),
        },
        {
          Header: "Resident",
          accessor: (row) => (row.resident_name ? row.resident_name : "-"),
        },
        {
          Header: "Unpaid Amount",
          accessor: (row) => toMoney(row.unpaid_amount),
        },
        {
          Header: "Additional Charges",
          accessor: (row) => toMoney(row.additional_charge),
        },
        { Header: "Penalty", accessor: (row) => toMoney(row.billing_penalty) },
        {
          Header: "Total Unpaid",
          accessor: (row) => <b>{toMoney(row.total)}</b>,
        },
      ]);
    }
  }, [role]);

  useEffect(() => {
    if (search.length === 0) setLimit(5);
  }, [search]);

  //   const columns = ;

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

  return (
    <>
      <UploadModal
        open={upload}
        toggle={() => setUpload(false)}
        templateLink={user.billing_bulk_template}
        filename="billing_unit_template.xlsx"
        uploadLink={endpointBilling + "/management/billing/upload"}
        uploadDataName="file_upload"
        resultComponent={uploadResult}
      />
      <TemplateWithSelection
        view={view}
        columns={columns}
        slice="billing"
        getAction={getBillingUnit}
        selectAction={(selectedRows) => {
          const selectedRowIds = [];
          selectedRows.map((row) => {
            selectedRowIds.push(row.id);
          });
          setMultiActionRows([...selectedRowIds]);
        }}
        filterVars={[building, upload]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: <p>Building: {building ? buildingName : "All"}</p>,
                  delete: () => setBuilding(""),
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search"
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
              ]
            : []
        }
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <Button
                    label="Upload Bulk"
                    icon={<FiUpload />}
                    onClick={() => setUpload(true)}
                  />,
                  <Button
                    label="Download .csv"
                    icon={<FiDownload />}
                    onClick={() =>
                      dispatch(downloadBillingUnit(search, building))
                    }
                  />,

                  <Button
                    label="Publish Selected"
                    disabled={Object.keys(selectedRowIds).length === 0}
                    icon={<FiUpload />}
                    onClick={() => {
                      dispatch(updateBillingPublish(multiActionRows));
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