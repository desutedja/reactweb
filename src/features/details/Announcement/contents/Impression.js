import React, { useCallback, useEffect, useState } from "react";
import parse from "html-react-parser";
import Table from "../../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormatter, toSentenceCase } from "../../../../utils";
import { FiSearch } from "react-icons/fi";
import Filter from "../../../../components/Filter";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { endpointAdmin } from "../../../../settings";
import { get } from "../../../slice";

function Component({ id, view }) {
  const { refreshToggle } = useSelector((state) => state.announcement);

  const [data, setData] = useState({ items: [] });

  const [buildings, setBuildings] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [buildingLimit, setBuildingLimit] = useState(5);

  const [unit, setUnit] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [units, setUnits] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [unitLimit, setUnitLimit] = useState(5);

  let dispatch = useDispatch();

  const columns = [
    // { Header: "ID", accessor: "id" },
    {
      Header: "Resident Name",
      accessor: (row) => (
        // <a href={"/" + role + "/announcement/" + row.id}>
        <span>{row.resident_name}</span>
        // </a>
      ),
    },
    {
      Header: "Unit Floor",
      accessor: (row) => <span>{row.unit_floor}</span>,
    },
    {
      Header: "Unit Number",
      accessor: (row) => <span>{row.unit_number}</span>,
    },
    {
      Header: "Building Name",
      accessor: (row) => <span>{row.building_name}</span>,
    },
    {
      Header: "Open Count",
      accessor: (row) => (
        <span style={{ alignContent: "center" }}>{row.open_count}</span>
      ),
    },
    {
      Header: "First Open",
      accessor: (row) => (
        <span style={{ alignContent: "center" }}>
          {dateTimeFormatter(row.created_on, "-")}
        </span>
      ),
    },
  ];

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

  useEffect(() => {
    building &&
      dispatch(
        get(
          endpointAdmin +
            "/building/unit" +
            "?page=1" +
            "&building_id=" +
            building +
            "&search=" +
            unitSearch +
            "&sort_field=created_on&sort_type=DESC" +
            "&limit=" +
            unitLimit,
          (res) => {
            let data = res.data.data.items;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            const formatted = res.data.data.items.map((el) => ({
              label:
                toSentenceCase(el.section_type) +
                " " +
                el.section_name +
                " " +
                el.number,
              value: el.id,
            }));

            if (data.length < totalItems && unitSearch.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setUnits(formatted);
          }
        )
      );
  }, [building, dispatch, unitLimit, unitSearch]);

  return (
    <div>
      <div
        className=""
        style={{
          marginRight: 16,
          flexDirection: "column",
          padding: 0,
        }}
      >
        <div className="row no-gutters">
          <div className="col" style={{ minWidth: 150, maxWidth: 300 }}>
            <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
              <div
                className="row no-gutters align-items-center"
                style={{ minWidth: 150 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: 200,
                  }}
                >
                  <div
                    style={{
                      marginRight: 16,
                    }}
                  >
                    Total Open Count :
                  </div>
                  <div>
                    <b>
                      {data?.total_open_count
                        ? data?.total_open_count
                        : 0
                      }
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={data?.items || []}
        fetchData={useCallback(
          (page, limit, searchItem, sortField, sortType) => {
            dispatch(
              get(
                endpointAdmin +
                  "/announcement/impressionAnnouncement?announcement_id=" +
                  id +
                  "&page=" +
                  (page + 1) +
                  "&limit=" +
                  limit +
                  "&building_id=" +
                  building +
                  "&building_unit_id=" +
                  unit,
                (res) => {
                  console.log(res.data.data);
                  setData(res.data.data);
                }
              )
            );
          },
          [dispatch, id, building, unit, refreshToggle]
        )}
        pageCount={data?.total_page}
        totalItems={data?.total_items}
        filters={[
          {
            hidex: building === "",
            label: "Building: ",
            value: building ? buildingName : "All",
            delete: () => {
              setBuilding("");
              setUnit("");
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
                    setUnit("");
                    toggleModal(false);
                  }}
                  onClickAll={() => {
                    setBuilding("");
                    setBuildingName("");
                    setBuildingLimit(5);
                    setUnit("");
                    toggleModal(false);
                  }}
                />
              </>
            ),
          },
          ...(building
            ? [
                {
                  hidex: unit === "",
                  label: "Unit: ",
                  value: unit ? unitLabel : "All",
                  delete: () => {
                    setUnit("");
                  },
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Unit"
                        compact
                        icon={<FiSearch />}
                        inputValue={unitSearch}
                        setInputValue={setUnitSearch}
                      />
                      <Filter
                        data={units}
                        onClick={(el) => {
                          if (!el.value) {
                            setUnitLimit(unitLimit + el.restTotal);
                            return;
                          }
                          setUnit(el.value);
                          setUnitLabel(el.label);
                          setUnitLimit(5);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setUnit("");
                          setUnitLimit(5);
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />
      {/* <Table
        noSearch
        columns={columns}
        data={data.impression}
        pageCount={data.filtered_page}
        totalItems={data.filtered_item}
        actionDownloads={
          view
            ? null
            : [
                <Button
                  color="Download"
                  // label={"Open Count: " + data.totalCount}
                  label={"Open Count: " + buildingName}
                />,
              ]
        }
        filters={[
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
          ...(building
            ? [
                {
                  hidex: unit === "",
                  label: "Unit: ",
                  value: unit ? unitLabel : "All",
                  delete: () => {
                    setUnit("");
                  },
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Unit"
                        compact
                        icon={<FiSearch />}
                        inputValue={unitSearch}
                        setInputValue={setUnitSearch}
                      />
                      <Filter
                        data={units}
                        onClick={(el) => {
                          if (!el.value) {
                            setUnitLimit(unitLimit + el.restTotal);
                            return;
                          }
                          setUnit(el.value);
                          setUnitLabel(el.label);
                          setUnitLimit(5);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setUnit("");
                          setUnitLimit(5);
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
              ]
            : []),
        ]}
      ></Table> */}
    </div>
  );
}

export default Component;
