import React, { useCallback, useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import Table from "../../../../components/TableImpression";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormatter } from "../../../../utils";
import { endpointAdmin, endpointAds } from "../../../../settings";
import { get } from "../../../slice";
import Filter from "../../../../components/Filter";
import Input from "../../../../components/Input";
import { FiSearch } from "react-icons/fi";

function Component({ id, view }) {
  const [data, setData] = useState({ items: [] });
  const [buildingList, setBuildingList] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingLabel, setBuildingLabel] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  let dispatch = useDispatch();

  const { refreshToggle } = useSelector((state) => state.ads);

  const columns = [
    {
      Header: "Resident Name",
      accessor: (row) => <span>{row.resident_name}</span>,
    },
    {
      Header: "Building Name",
      accessor: (row) => <span>{row.building_name}</span>,
    },
    {
      Header: "Actual View",
      accessor: (row) => (
        <div className="text-center">
          <span>{row.actual_view}</span>
        </div>
      ),
    },
    {
      Header: "Repeated View",
      accessor: (row) => (
        <div className="text-center">
          <span>{row.repeated_view}</span>
        </div>
      ),
    },
    {
      Header: "Actual Click",
      accessor: (row) => (
        <div className="text-center">
          <span>{row.actual_click}</span>
        </div>
      ),
    },
    {
      Header: "Repeated Click",
      accessor: (row) => (
        <div className="text-center">
          <span>{row.repeated_click}</span>
        </div>
      ),
    },
    {
      Header: "First Open",
      accessor: (row) => (
        <span style={{ alignContent: "center" }}>
          {dateTimeFormatter(row.first_open, "-")}
        </span>
      ),
    },
  ];

  useEffect(() => {
    (!search || search.length >= 1) &&
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

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            if (data.length < totalItems && search.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setBuildingList(formatted);
          }
        )
      );
  }, [dispatch, search, limit]);

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
          <div className="col">
            <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
              <div
                className="row no-gutters align-items-center"
                style={{ minWidth: 150 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: 16,
                    }}
                  >
                    Total Actual View :
                  </div>
                  <div>
                    <b>
                      {data?.items.total_advertisement_impression
                        ?.total_actual_view
                        ? data?.items.total_advertisement_impression
                            ?.total_actual_view
                        : 0}
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
              <div
                className="row no-gutters align-items-center"
                style={{ minWidth: 150 }}
              >
                <div className="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginRight: 16,
                      }}
                    >
                      Total Repeated View :
                    </div>
                    <div>
                      <b>
                        {data?.items.total_advertisement_impression
                          ?.total_repeated_view
                          ? data?.items.total_advertisement_impression
                              ?.total_repeated_view
                          : 0}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
              <div
                className="row no-gutters align-items-center"
                style={{ minWidth: 150 }}
              >
                <div className="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginRight: 16,
                      }}
                    >
                      Total Actual Click :
                    </div>
                    <div>
                      <b>
                        {data?.items.total_advertisement_impression
                          ?.total_actual_click
                          ? data?.items.total_advertisement_impression
                              ?.total_actual_click
                          : 0}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
              <div
                className="row no-gutters align-items-center"
                style={{ minWidth: 150 }}
              >
                <div className="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginRight: 16,
                      }}
                    >
                      Total Repeated Click :
                    </div>
                    <div>
                      <b>
                        {data?.items.total_advertisement_impression
                          ?.total_repeated_click
                          ? data?.items.total_advertisement_impression
                              ?.total_repeated_click
                          : 0}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={data?.items.advertisement_impression || []}
        fetchData={useCallback(
          (page, limit, searchItem, sortField, sortType) => {
            dispatch(
              get(
                endpointAds +
                  "/management/ads/impression/list" +
                  "?page=" +
                  (page + 1) +
                  "&limit=" +
                  limit +
                  "&advertisement_id=" +
                  id +
                  "&building_id=" +
                  building +
                  "&search=" +
                  searchItem,
                (res) => {
                  console.log(res.data.data);
                  setData(res.data.data);
                }
              )
            );
          },
          [dispatch, id, building, refreshToggle]
        )}
        pageCount={data?.TotalPage}
        totalItems={data?.TotalItem}
        filters={[
          {
            label: "Building: ",
            value: building ? buildingLabel : "All",
            hidex: building === "",
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
                  data={buildingList}
                  onClick={(el) => {
                    if (!el.value) {
                      setLimit(limit + el.restTotal);
                      return;
                    }
                    setBuilding(el.value);
                    setBuildingLabel(el.label);
                    setLimit(5);
                    toggleModal(false);
                  }}
                  onClickAll={() => {
                    setBuilding("");
                    setBuildingLabel("");
                    setLimit(5);
                    toggleModal(false);
                  }}
                />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Component;
