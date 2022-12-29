import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCatatmeter, downloadCatatMeter } from "../slices/catatmeter";
import Template from "./components/Template";
import Button from "../../components/Button";
import { FiDownload } from "react-icons/fi";
import Filter from "../../components/Filter";
import { get } from "../slice";
import { endpointAdmin } from "../../settings";
import { dateTimeFormatterstriped } from "../../utils";

const columns = [
  {
    Header: "Building Name",
    accessor: "building_name",
    sorting: "bld.name",
  },
  // {
  //   Header: "Unit ID",
  //   accessor: "unit_id",
  //   sorting: "unit_id"
  // },
  {
    Header: "Unit",
    accessor: "unit",
    sorting: "c.number",
  },
  // {
  //   Header: "Records ID",
  //   accessor: "records_id",
  //   sorting: "b.id"
  // },
  {
    Header: "Year",
    accessor: "year",
    sorting: "b.year",
  },
  {
    Header: "Month",
    accessor: "month",
    sorting: "b.month",
  },
  {
    Header: "Recent Usage",
    accessor: "recent_usage",
    sorting: "b.recent_usage",
  },
  {
    Header: "Current Usage",
    accessor: "current_usage",
    sorting: "b.current_usage",
  },
  // {
  //     Header: "Staff ID",
  //     accessor: "staff_id",
  //     sorting: "b.staff_id"
  // },
  {
    Header: "Staff Name",
    accessor: "staff_name",
    sorting: "d.firstname",
  },
  // {
  //     Header: "Published",
  //     accessor: "published",
  //     sorting: "b.published"
  // },
  {
    Header: "Meter Type",
    accessor: "metername",
    sorting: "g.name",
  },
  {
    Header: "Power",
    // accessor: "power",
    accessor: (row) => (row.power === "" ? "-" : row.power),
    sorting: "g.power",
  },
  {
    Header: "Image",
    accessor: (row) => (
      <a target="_blank" rel="noopener noreferrer" href={row.image}>
        Image
      </a>
    ),
    sorting: "b.image",
  },
  // {
  //   Header: "Created On",
  //   accessor: "created_on",
  //   sorting: "b.created_on",
  //   Cell: (props) => {
  //     //props.value will contain your date
  //     //you can convert your date here
  //     let dates = new Date(props.value);
  //     const custom_date =
  //       dates.getFullYear() +
  //       "-" +
  //       String(parseInt(dates.getMonth() + 1)).padStart(2, "0") +
  //       "-" +
  //       dates.getDate() +
  //       " " +
  //       dates.getHours() +
  //       ":" +
  //       dates.getMinutes() +
  //       ":" +
  //       dates.getSeconds();
  //     return <span>{custom_date}</span>;
  //   },
  // },
  {
    Header: "Created On",
    accessor: (row) =>
      row.created_on !== "0000-00-00 00:00:00"
        ? dateTimeFormatterstriped(row.created_on)
        : "-",
  },
];

function Component({ view, canAdd }) {
  let dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { role, user } = useSelector((state) => state.auth);

  const [file, setFile] = useState();
  const [data, setData] = useState();

  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/building" +
          "?limit=50" +
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
  }, [dispatch, search]);

  useEffect(() => {
    // console.log(file);

    let form = new FormData();
    form.append("catatmeter", file);

    setData(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  return (
    <>
      <Template
        view={view}
        pagetitle="Catat Meter"
        columns={columns}
        slice={"catatmeter"}
        getAction={getCatatmeter}
        filterVars={[building]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: <p>Building: {building ? buildingName : "All"}</p>,
                  delete: () => setBuilding(""),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={buildings}
                        onClick={(el) => {
                          if (!el.value) {
                            return;
                          }
                          setBuilding(el.value);
                          setBuildingName(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setBuilding("");
                          setBuildingName("");
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
              ]
            : []
        }
        // onClickEdit={
        //   view
        //     ? null
        //     : (row) => {

        //       dispatch(setSelected(row));
        //       history.push(url + "/edit");
        //       console.log(row);
        //     }

        // }
        actionDownloads={
          view ? null : (
            <Button
              fontWeight={500}
              color="Download"
              label="Download Catat Meter.csv"
              icon={<FiDownload />}
              onClick={() => {
                dispatch(
                  downloadCatatMeter(
                    document.getElementById("Search").value,
                    building
                  )
                );
              }}
            />
          )
        }
      />
    </>
  );
}

export default Component;
