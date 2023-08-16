import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pill from "../../components/Pill";
import Loading from "../../components/Loading";
import Filter from "../../components/Filter";
import Input from "../../components/Input";
import ButtonWizard from "../../components/ButtonWizard";



import {
  FiDownload,
  FiHelpCircle,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

import { dateTimeFormatter, toSentenceCase } from "../../utils";

import TemplateRequestPremium from "./components/TemplateRequestPremium";
import { post, getFile, get } from "../slice";
import {
  endpointResident,
  request_premium_status,
  request_premium_unit_status,
  endpointAdmin,
} from "../../settings";
import {
  getRequestPremium,
  approvedResident,
  disapprovedResident,
} from "../slices/requestpremium";

const columns = [
  {
    Header: "Resident Name",
    accessor: "resident_name",
    sorting: "resident_name",
  },
  {
    Header: "Unit Number",
    accessor: "number",
    sorting: "number",
  },
  {
    Header: "Building",
    accessor: "building_name",
    sorting: "building",
  },
  {
    Header: "Email",
    accessor: (row) => row.email !== "" ? toSentenceCase(row.email) : "-",
    sorting: "email",
  },
  {
    Header: "Phone",
    accessor: "phone",
    sorting: "phone",
  },
  {
    Header: "Status",
    accessor: (row) => toSentenceCase(row.status),
    sorting: "status",
  },
  {
    Header: "Approved",
    accessor: (row) => (
      <Pill
        color={row.approved_status === "approved" ? "success" : "secondary"}
      >
        {toSentenceCase(row.approved_status) === "-"
          ? "Pending"
          : toSentenceCase(row.approved_status)}
      </Pill>
    ),
    sorting: "approved_status",
  },
  {
    Header: "Approved By",
    accessor: "staff_name",
    sorting: "staff_name",
  },
  {
    Header: "Request Date",
    accessor: (row) => dateTimeFormatter(row.created_on),
    sorting: "created_on",
  },
  {
    Header: "Approved Date",
    accessor: (row) => dateTimeFormatter(row.approved_on),
    sorting: "approved_on",
  },
];

const residentEndpoint = endpointResident + "/management/resident";

function Component({ view, canAdd }) {
  const { role, user } = useSelector((state) => state.auth);

  const [openWizard, setOpenWizard] = useState(false);

  const [loading, setLoading] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [approved_status, setApprovedStatus] = useState("");
  const [status, setStatus]  = useState("");


  const [buildings, setBuildings] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [buildingLimit, setBuildingLimit] = useState(5);

  let fileInput = useRef();

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    // console.log(file);

    let form = new FormData();
    form.append("resident", file);

    setData(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // useEffect(() => {
  //   // console.log(data);
  // }, [data]);

  useEffect(() => {
    (!buildingSearch || buildingSearch.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?limit=" +
            buildingLimit +
            "&page=1" +
            "&search=" +
            buildingSearch,
          (res) => {
            let data = res.data.data.items;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            if (data.length < totalItems && buildingSearch.length === 0) {
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
  }, [dispatch, buildingSearch, buildingLimit]);

  return (
    <>
      <TemplateRequestPremium
        view={view}
        pagetitle="Request Premium User List"
        columns={columns}
        slice={"requestpremium"}
        getAction={getRequestPremium}
        actions={view ? null : (role === "bm" ? !canAdd : false) ? null : []}
        approvedAction={
          view ? null : (role === "sa" || role === "bm") && approvedResident
        }
        disapprovedAction={
          view ? null : (role === "sa" || role === "bm") && disapprovedResident
        }
        filterVars={[approved_status, building, status]}
        actionDownloads={
          view
            ? null
            : [
                <Button
                  fontWeight={500}
                  color="Download"
                  key="Download Request Premium User"
                  label="Download Request Premium User.csv"
                  icon={<FiDownload />}
                  onClick={() => {
                    setLoading(true);
                    dispatch(
                      getFile(
                        residentEndpoint +
                          "/get_basicuser/v2" +
                          "?page=1" +
                          "&limit=100000" +
                          "&search=" +
                          document.getElementById("Search").value +
                          "&approved_status=" +
                          approved_status +
                          "&sort_field=created_on&sort_type=DESC" + 
                          "&building_id=" +
                          building+
                          "&status="+
                          status+
                          "&export=true",
                        "Data_Request_Premium_User.csv",
                        (res) => {
                          setLoading(false);
                        },
                        (err) => {
                          setLoading(false);
                        }
                      )
                    );
                  }}
                />,
              ]
        }
        filters={[
          ...(role !== "bm"
            ? [
                {
                  hidex: building === "",
                  label: "Building: ",
                  value: building ? buildingName : "All",
                  delete: () => {
                    setBuilding("");
                  },
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Building"
                        compact
                        icon={<FiSearch />}
                        inputValue={buildingSearch}
                        setInputValue={setBuildingSearch}
                      />
                      <Filter
                        data={buildings}
                        onClick={(el) => {
                          if (!el.value) {
                            setBuildingLimit(buildingLimit + el.restTotal);
                            return;
                          }
                          setBuilding(el.value);
                          setBuildingName(el.label);
                          setBuildingLimit(5);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setBuilding("");
                          setBuildingName("");
                          setBuildingLimit(5);
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
              ]
            : []),
          {
            hidex: approved_status === "",
            label: (
              <p>
                {approved_status
                  ? "Approved Status: " + approved_status
                  : "Approved Status: All"}
              </p>
            ),
            delete: () => {
              setApprovedStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={request_premium_status}
                onClickAll={() => {
                  setApprovedStatus("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setApprovedStatus(el.value);
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: status === "",
            label: (
              <p>
                {status
                  ? "Status: " + status
                  : "Status: All"}
              </p>
            ),
            delete: () => {
              setStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={request_premium_unit_status}
                onClickAll={() => {
                  setStatus("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setStatus(el.value);
                  toggleModal(false);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}

export default Component;
