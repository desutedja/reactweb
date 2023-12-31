import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AnimatedNumber from "animated-number-react";

import { RiTaskLine, RiFileExcelLine, RiFileChartLine } from "react-icons/ri";

import { getSOS } from "./slice";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from "recharts";
import { getDatesRange, months } from "../../utils";
import { endpointTask, endpointAdmin } from "../../settings";

import moment from "moment";

import "./style.css";
import { get } from "../slice";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import InputDash from "../../components/InputDash";
import Filter from "../../components/Filter";
import { FiSearch } from "react-icons/fi";
import { toSentenceCase } from "../../utils";

const formatValue = (value) => value.toFixed(0);

const colors = ["#2ad170", "#007bff", "#f7b733", "#ed4057"];

function Component() {
  const history = useHistory();
  const { sosData } = useSelector((state) => state.dashboard);
  const { auth, dashboard } = useSelector((state) => state);

  const today = moment().format("yyyy-MM-DD", "day");

  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState("ytd");
  const [pieData, setPieData] = useState([]);
  const [taskData, setTaskData] = useState({});
  const [sosDataFormatted, setSosDataFormatted] = useState();
  const [buildingDatas, setBuildingDatas] = useState([]);
  const [sectionDatas, setSectionDatas] = useState([]);
  const [openModalBuilding, setOpenModalBuilding] = useState(false);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [tower, setTower] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingLabel, setBuildingLabel] = useState("");
  const [periode, setPeriode] = useState("all");
  const [periodeTime, setPeriodeTime] = useState(today);
  const [selectedCard, setSelectedCard] = useState(1);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSOS(range, buildingName, tower));
  }, [dispatch, range, buildingName, tower]);

  // useEffect(() => {
  //     setLoading(true);
  //     dispatch(get(endpointTask + '/admin/sa/statistics?range=' + range + '&tower=' + tower,
  //         res => {
  //             setLoading(false);
  //             setPieData(res.data.data.ticket_by_category);
  //             setTaskData(res.data.data);
  //         }))
  // }, [dispatch, range, tower]);

  useEffect(() => {
    setLoading(true);
    if (auth.role === "sa") {
      dispatch(
        get(
          endpointTask +
            "/admin/sa/statistics?range=" +
            range +
            "&building_id=" +
            buildingName +
            "&tower=" +
            tower,
          (res) => {
            setLoading(false);
            setPieData(res.data.data.ticket_by_category);
            setTaskData(res.data.data);
          }
        )
      );
    } else if (auth.role === "bm") {
      dispatch(
        get(
          endpointTask +
            "/admin/pic_bm/statistics?range=" +
            range +
            "&tower=" +
            tower,
          (res) => {
            setLoading(false);
            setPieData(res.data.data.ticket_by_category);
            setTaskData(res.data.data);
          }
        )
      );
    }
  }, [dispatch, auth.role, range, buildingName, tower]);

  useEffect(() => {
    openModalBuilding &&
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

            setBuildingDatas(formatted);
          }
        )
      );
  }, [dispatch, search, limit, openModalBuilding]);

  useEffect(() => {
    openModalUnit &&
      dispatch(
        get(
          endpointAdmin + "/building/getsection?building_id=" + buildingName,
          (res) => {
            let data = res.data.data;

            let formatted = data.map((el) => ({
              label:
                toSentenceCase(el.section_type) +
                " " +
                toSentenceCase(el.section_name),
              value: el.id,
            }));

            setSectionDatas(formatted);
          }
        )
      );
  }, [dispatch, openModalUnit]);

  useEffect(() => {
    if (range === "dtd") {
      const aDaysBefore = new Date().setHours(new Date().getHours() - 24);
      const hoursRange = getDatesRange(
        new Date(aDaysBefore),
        new Date(),
        "hours"
      );
      const sosDatas = hoursRange.map((date) => {
        const data = sosData.filter(
          (data) =>
            data.time.split("T")[0] + data.time.split("T")[1].split(":")[0] ===
            date.split(" ")[0] + date.split(" ")[1].split(":")[0]
        );
        return {
          time: date,
          num_of_sos: data.reduce((total, data) => {
            return total + data.num_of_sos;
          }, 0),
        };
      });
      const sosDataFormatted = sosDatas.map((data, i) => {
        let day = moment(data.time).format("dddd");
        const hour = moment(data.time).format("HH:00");
        return {
          SOS: data.num_of_sos,
          Time: `${day.substring(0, 3)} ${hour}`,
          index: i,
        };
      });
      setSosDataFormatted(sosDataFormatted);
    }

    if (range === "mtd") {
      const aMonthBefore = new Date().setDate(new Date().getDate() - 30);
      const datesRange = getDatesRange(
        new Date(aMonthBefore),
        new Date(),
        "days"
      );
      const sosDatas = datesRange.map((date) => {
        const data = sosData.filter(
          (data) => data.time.split("T")[0] === date.split(" ")[0]
        );
        return {
          time: data[0] ? data[0].time.split("T")[0] : date.split(" ")[0],
          num_of_sos: data.reduce((total, data) => {
            return total + data.num_of_sos;
          }, 0),
        };
      });
      const sosDataFormatted = sosDatas.map((data, i) => {
        let month = months[data.time.split("-")[1] - 1].label;
        // if (!(sosDatas[i].time.split('-')[1] !== (sosDatas[i - 1] ? sosDatas[i - 1].time.split('-')[1] : sosDatas[i - 1]))) month = '';
        const date = data.time.split("-")[2];
        return {
          SOS: data.num_of_sos,
          Time: `${month.substring(0, 3)} ${date}`,
          index: i,
        };
      });
      setSosDataFormatted(sosDataFormatted);
    }

    if (range === "ytd") {
      const aYearBefore = new Date().setFullYear(new Date().getFullYear() - 1);
      const monthsRange = getDatesRange(
        new Date(aYearBefore),
        new Date(),
        "months"
      );
      const sosDatas = monthsRange.map((date) => {
        const data = sosData.filter(
          (data) =>
            data.time.split("T")[0].split("-")[0] +
              data.time.split("T")[0].split("-")[1] ===
            date.split(" ")[0].split("-")[0] + date.split(" ")[0].split("-")[1]
        );
        return {
          time: data[0] ? data[0].time.split("T")[0] : date,
          num_of_sos: data.reduce((total, data) => {
            return total + data.num_of_sos;
          }, 0),
        };
      });
      const sosDataFormatted = sosDatas.map((data, i) => {
        let month = months[data.time.split("-")[1] - 1].label;
        return {
          SOS: data.num_of_sos,
          Time: `${month.substring(0, 3)} ${data.time.split("-")[0]}`,
          index: i,
        };
      });
      setSosDataFormatted(sosDataFormatted);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosData]);

  return (
    <Loading loading={loading}>
      <Modal
        title="Choose Building"
        subtitle="Choose building to set filter"
        isOpen={openModalBuilding}
        toggle={() => setOpenModalBuilding(false)}
        cancelLabel="Cancel"
        disableFooter
        onClickSecondary={() => {
          setBuildingName({});
          setOpenModalBuilding(false);
        }}
      >
        <>
          <Input
            label="Search Building"
            compact
            icon={<FiSearch />}
            inputValue={search}
            setInputValue={setSearch}
          />
          <Filter
            data={buildingDatas}
            onClick={(el) => {
              if (!el.value) {
                setLimit(limit + el.restTotal);
                return;
              }
              setBuildingName(el.value);
              setBuildingLabel(el.label);
              setTower("");
              setLimit(5);
              setOpenModalBuilding(false);
            }}
            onClickAll={() => {
              setBuildingName("");
              setBuildingLabel("");
              setTower("");
              setLimit(5);
              setOpenModalBuilding(false);
            }}
          />
        </>
        {buildingDatas.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No building data found.
          </p>
        )}
      </Modal>
      <Modal
        title="Choose Unit Section"
        subtitle="Choose unit section to set filter"
        isOpen={openModalUnit}
        toggle={() => setOpenModalUnit(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setTower({});
          setOpenModalUnit(false);
        }}
      >
        <>
          <Filter
            data={sectionDatas}
            onClick={(el) => {
              setTower(el.value);
              setUnitLabel(el.label);
              setLimit(5);
              setOpenModalUnit(false);
            }}
            onClickAll={() => {
              setTower("");
              setUnitLabel("");
              setLimit(5);
              setOpenModalUnit(false);
            }}
          />
        </>
        {sectionDatas.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No section data found.
          </p>
        )}
      </Modal>
      <div className="row no-gutters">
        <div className="col-12">
          <div
            className=" flex-column"
            style={{ overflow: "visible", borderRadius: 10 }}
          >
            <div className="row no-gutters">
              <div className="col-12">
                <div className="row pl-3 mb-0">
                  <div
                    className="row no-gutters w-100"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
                      <h2
                        className="mt-2 mb-4 no-wrap"
                        style={{ marginLeft: 20, fontWeight: 600 }}
                      >
                        Task Statistics
                      </h2>
                    </div>

                    <div
                      className="col-auto d-flex flex-column mt-2 mr-3"
                      style={{ marginLeft: 20 }}
                    >
                      {auth.role === "bm" ? (
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <div
                            style={{ marginLeft: 5 }}
                            className="Group2"
                            onClick={() => setOpenModalUnit(true)}
                          >
                            {tower ? unitLabel : "Section"}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <div
                            className="Group2"
                            onClick={() => setOpenModalBuilding(true)}
                          >
                            {buildingName ? (
                              <div>
                                Building: <b>{buildingLabel}</b>
                              </div>
                            ) : (
                              <div>
                                Building: <b>All</b>
                              </div>
                            )}
                          </div>
                          {buildingName ? (
                            <div
                              style={{ marginLeft: 5 }}
                              className="Group2"
                              onClick={() => setOpenModalUnit(true)}
                            >
                              {tower ? (
                                <div>
                                  Section: <b>{unitLabel}</b>
                                </div>
                              ) : (
                                <div>
                                  Section: <b>All</b>
                                </div>
                              )}
                            </div>
                          ) : (
                            []
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="p-3 col-6 text-right">
                      <Button
                        className="btn-cancel"
                        label="Download Report"
                        icon={<FiDownload />}
                      />
                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row no-gutters">
        <div className="Container-dashboard flex-column">
          <div className="row no-gutters">
            <div
              className="col-sm-1 mt-1 ml-3 text-nowrap"
              style={{ minWidth: 100 }}
            >
              Periode Data:
            </div>
            <div className="col-sm-2 w-100" style={{ minWidth: 170 }}>
              <InputDash
                type="select"
                options={[
                  { label: "Semua Data", value: "all" },
                  { label: "Berdasarkan Tahun", value: "year" },
                  { label: "Berdasarkan Bulan", value: "month" },
                  { label: "Berdasarkan Hari", value: "day" },
                ]}
                inputValue={periode}
                setInputValue={setPeriode}
              />
            </div>
            {periode === "year" ? (
              // <div className="col-sm-2" style={{minWidth:100}}>
              //     <InputDash type="select" options={years}
              //     inputValue={periodeByYear} setInputValue={setPeriodeByYear}
              //     />
              // </div>
              // :
              // periode === "month" ?
              // <div className="col-sm-2" style={{minWidth:100}}>
              //     <div className="TableDatePicker-2 d-flex align-items-center">
              //       <DatePicker
              //           selected={startDate}
              //           onChange={(periodeByMonth) => setStartDate(periodeByMonth)}
              //           maxDate={endDate}
              //           dateFormat="MMM-yyyy"
              //           showMonthYearPicker
              //       />
              //     </div>
              // </div>
              // :
              // <div className="col-sm-2" style={{minWidth:150}}>
              //     <InputDash type="date"
              //     inputValue={periodeTime} setInputValue={setPeriodeTime}
              //     />
              // </div>
              <div className="col-sm-2" style={{ minWidth: 150 }}>
                <InputDash
                  type="date"
                  inputValue={periodeTime}
                  setInputValue={setPeriodeTime}
                />
              </div>
            ) : periode === "month" ? (
              <div className="col-sm-2" style={{ minWidth: 150 }}>
                <InputDash
                  type="date"
                  inputValue={periodeTime}
                  setInputValue={setPeriodeTime}
                />
              </div>
            ) : (
              <div className="col-sm-2" style={{ minWidth: 150 }}>
                <InputDash
                  type="date"
                  inputValue={periodeTime}
                  setInputValue={setPeriodeTime}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row no-gutters">
        <div className="col-12">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div
              className="col"
              style={{ paddingBottom: "16px", paddingTop: "5px" }}
            >
              <h5 className="task-text-h5">Statistik Keseluruhan</h5>
              <p className="task-text-gray task-text-p">
                Pantau data statistik untuk tingkatkan kinerjamu.
              </p>
            </div>
            <div className="row no-gutters mt-2">
              <div className="col" style={{ maxWidth: "250px" }}>
                <div
                  className={`Container-dashboard-ns ${
                    selectedCard === 1 ? "border-1" : "border-2"
                  } d-flex flex-column cursor-pointer`}
                  onClick={() => {
                    setSelectedCard(1);
                  }}
                >
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Semua Task
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                              ? decimal(
                                  ((taskData.task_statistic -
                                    taskData.task_statistic_prev) /
                                    taskData.task_statistic_prev) *
                                    100
                                )
                              : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Semua Task
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ maxWidth: "250px" }}>
                <div
                  className={`Container-dashboard-ns ${
                    selectedCard === 2 ? "border-1" : "border-2"
                  } d-flex flex-column cursor-pointer`}
                  onClick={() => {
                    setSelectedCard(2);
                  }}
                >
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Service
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_unresolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Service
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_unresolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ maxWidth: "250px" }}>
                <div
                  className={`Container-dashboard-ns ${
                    selectedCard === 3 ? "border-1" : "border-2"
                  } d-flex flex-column cursor-pointer`}
                  onClick={() => {
                    setSelectedCard(3);
                  }}
                >
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Security
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Security
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ maxWidth: "250px" }}>
                <div
                  className={`Container-dashboard-ns ${
                    selectedCard === 4 ? "border-1" : "border-2"
                  } d-flex flex-column cursor-pointer`}
                  onClick={() => {
                    setSelectedCard(4);
                  }}
                >
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          SOS
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          SOS
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-12 col-md">
                <div className="Container-dashboard-ns flex-column pb-5 pr-4">
                  <div className="row mb-5 justify-content-between">
                    <div className="col">
                      <h5>SOS Statistics</h5>
                    </div>
                    <div className="col-auto">
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <div
                          className={
                            range === "dtd" ? "GroupActive color-3" : "Group"
                          }
                          onClick={() => setRange("dtd")}
                        >
                          DTD
                        </div>
                        <div
                          className={
                            range === "mtd" ? "GroupActive color-3" : "Group"
                          }
                          onClick={() => setRange("mtd")}
                        >
                          MTD
                        </div>
                        <div
                          className={
                            range === "ytd" ? "GroupActive color-3" : "Group"
                          }
                          onClick={() => setRange("ytd")}
                        >
                          YTD
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col px-4"
                      style={{
                        height: "390px",
                        position: "relative",
                      }}
                    >
                      <ResponsiveContainer width="100%">
                        <ComposedChart data={sosDataFormatted}>
                          <XAxis height={30} dy={10} dataKey="Time" />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            dx={-10}
                            dataKey="SOS"
                          />
                          <Tooltip />
                          <CartesianGrid
                            vertical={false}
                            stroke="#ddd"
                            dataKey="Time"
                          />
                          <Bar
                            className="cursor-pointer"
                            onClick={() => {
                              history.push("/" + auth.role + "/task");
                            }}
                            radius={4}
                            dataKey="SOS"
                            fill="#e12029"
                            maxBarSize={80}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-12">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div
              className="col"
              style={{ paddingBottom: "16px", paddingTop: "5px" }}
            >
              <h5 className="task-text-h5">Data Berdasarkan Status Task</h5>
              <p className="task-text-gray task-text-p">
                Pantau jumlah task berdasarkan status.
              </p>
            </div>
            <div className="row no-gutters">
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dibuat
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dibuat
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Ditugaskan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Ditugaskan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dikerjakan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dikerjakan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dilaporkan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Dilaporkan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Selesai
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Selesai
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Tidak Bisa Dikerjakan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Tidak Bisa Dikerjakan
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Laporan Ditolak
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Laporan Ditolak
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col" style={{ minWidth: "240px" }}>
                <div className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer">
                  {periode !== "all" ? (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Laporan Diterima
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap"
                              >
                                <font style={{ color: "#C4C4C4" }}>
                                  vs
                                  {periode === "year"
                                    ? " Tahun"
                                    : periode === "month"
                                    ? " Bulan"
                                    : periode === "day"
                                    ? " Hari"
                                    : " " + toSentenceCase(periode)}{" "}
                                  Lalu:
                                </font>
                                <AnimatedNumber
                                  className="font-weight-bold black ml-2"
                                  // value={taskData.task_statistic_prev}
                                  value={100}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div
                                style={{ fontSize: 12 }}
                                className="text-nowrap ml-3 float-right"
                              >
                                <font style={{ color: "#52A452" }}>
                                  {/* {taskData.task_statistic_prev !== 0
                            ? decimal(
                                ((taskData.task_statistic -
                                  taskData.task_statistic_prev) /
                                  taskData.task_statistic_prev) *
                                  100
                              )
                            : 0} */}
                                  %
                                </font>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="text-nowrap task-text-container">
                          Laporan Diterima
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black"
                          value={taskData.total_resolved_task}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {auth.role === "bm" && (
        <div className="row no-gutters">
          <div className="col">
            <div className="Container-dashboard flex-column h-100">
              <div className="row mb-4">
                <div className="col">
                  <h5>Most Resolver This Month</h5>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="list-stats">
                    {taskData.task_resolver_this_month?.length > 0 ? (
                      taskData.task_resolver_this_month.map((resolver, i) => (
                        <li
                          className="row no-gutters align-items-center bread"
                          onClick={() => {
                            history.push(
                              "/" + auth.role + "/staff/" + resolver.assignee
                            );
                          }}
                        >
                          <div className="col-auto">
                            <div
                              style={{
                                width: "40px",
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                              }}
                            >
                              #{i + 1}
                            </div>
                          </div>
                          <div className="col">
                            <div>
                              <b>
                                {resolver.firstname + " " + resolver.lastname}
                              </b>
                            </div>
                            <div className="text-capitalize">
                              {resolver.staff_role.replace("_", " ")}
                            </div>
                          </div>
                          <div className="col-auto BigNumber">
                            {resolver.resolved_task}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-center">No resolver</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container-dashboard flex-column h-100">
              <div className="row mb-4">
                <div className="col">
                  <h5>Most Resolver Last Month</h5>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="list-stats">
                    {taskData.task_resolver_last_month?.length > 0 ? (
                      taskData.task_resolver_last_month.map((resolver, i) => (
                        <li
                          className="row no-gutters bread"
                          onClick={() => {
                            history.push(
                              "/" + auth.role + "/staff/" + resolver.assignee
                            );
                          }}
                        >
                          <div className="col-auto">
                            <div
                              style={{
                                width: "40px",
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                              }}
                            >
                              #{i + 1}
                            </div>
                          </div>
                          <div className="col">
                            <div>
                              <b>
                                {resolver.firstname + " " + resolver.lastname}
                              </b>
                            </div>
                            <div className="text-capitalize">
                              {resolver.staff_role.replace("_", " ")}
                            </div>
                          </div>
                          <div className="col-auto BigNumber black">
                            {resolver.resolved_task}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-center">No resolver</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Loading>
  );
}

export default Component;
