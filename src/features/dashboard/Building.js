import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import parser from "html-react-parser";
import InputDash from "../../components/InputDash";

import { FiSearch, FiChevronUp } from "react-icons/fi";
import {
  RiBuilding4Line,
  RiUserStarLine,
  RiUserFollowLine,
  RiUserLocationLine,
} from "react-icons/ri";

import {
  toMoney,
  getDatesRange,
  toSentenceCase,
  decimal,
  monthEnd,
  monthStart,
} from "../../utils";
import {
  endpointAdmin,
  endpointBilling,
  endpointManagement,
  endpointResident,
} from "../../settings";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../slice";
import { setNotificationData } from "../slices/notification";

import CardList from "../../components/CardList";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Filter from "../../components/Filter";
import BarChartDMY from "../../components/BarChartDMY";
import BarChartDMYAdm from "../../components/BarChartDMYAdm";
import Button from "../../components/Button";
import BillingItem from "../../components/cells/BillingItem";
import Loading from "../../components/Loading";
import DatePicker from "react-datepicker";
import TabDashboard from "../../components/TabDashboard";

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
  let dispatch = useDispatch();
  const history = useHistory();

  const { auth, notification } = useSelector((state) => state);

  const announcementLists = notification.items.filter(
    (item) => item.topic === "announcement"
  );

  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("dtd");
  const [tower, setTower] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingLabel, setBuildingLabel] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [section, setSection] = useState([]);
  const [billingData, setBillingData] = useState({});
  const [staffData, setStaffData] = useState({});
  const [unitStatistic, setUnitStatistic] = useState({});
  const [staffStatistic, setStaffStatistic] = useState({});
  const [residentStatistic, setResidentStatistic] = useState({});
  const [billingGraph, setBillingGraph] = useState([]);
  const [billingGraphFormatted, setBillingGraphFormatted] = useState([]);

  const today = moment().format("yyyy-MM-DD", "day");
  const [isTechnician, setIsTechnician] = useState(false);
  const [isCourier, setIsCourier] = useState(false);
  const [isSecurity, setIsSecurity] = useState(false);
  const [billingList, setBillingList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openModalBuilding, setOpenModalBuilding] = useState(false);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [buildingDatas, setBuildingDatas] = useState([]);
  const [sectionDatas, setSectionDatas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Time");
  const [periode, setPeriode] = useState("all");
  const [periodeTime, setPeriodeTime] = useState(today);
  const [startDateFrom, setStartDateFrom] = useState(monthStart());
  const [endDateFrom, setEndDateFrom] = useState(monthEnd());
  const [startDateTo, setStartDateTo] = useState(monthStart());
  const [endDateTo, setEndDateTo] = useState(monthEnd());
  const [selectedYear, setSelectedYear] = useState("");
  const [check, setCheck] = useState("");
  const { refreshToggle } = useSelector((state) => state.resident);
  // const [toggle, setToggle] = useState(false)
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const yearnow = new Date().getFullYear();
  const years = [];

  for (let i = yearnow - 3; i <= yearnow + 1; i++) {
    years.push({ value: i, label: i });
  }

  // const [periodeByYear, setPeriodeByYear] = useState(yearnow);
  const [periodeByYear, setPeriodeByYear] = useState(today);

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

  const tabs = ["", ""];
  const [type, setType] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // const [periodeByMonth, setPeriodeByMonth] = useState(monthnow);
  const [periodeByMonth, setPeriodeByMonth] = useState(today);

  const handleBillingSummary = (billingSummaries) => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 12, 0);
    const monthsRange = getDatesRange(
      new Date(startOfYear),
      new Date(endOfYear),
      "months"
    );

    const bList = [];
    const bListVal = [];
    billingSummaries.map((bSummary) => {
      if (bListVal.filter((x) => x === bSummary.summary_name).length === 0) {
        bListVal.push(bSummary.summary_name);
      }
    });

    monthsRange.map((date) => {
      const month = moment(date).format("MMM");
      const monthNumber = moment(date).format("M");
      const year = moment(date).format("YYYY");
      const billingSummary = billingSummaries.filter(
        (el) =>
          parseInt(el.month) === parseInt(monthNumber) &&
          parseInt(el.year) === parseInt(year)
      );
      const billArr = [];
      bListVal.map((bVal) => {
        const bItem = {
          month: month,
          summary_name: "",
          total_amount: 0,
          year: year,
        };
        bItem.summary_name = bVal;

        const billingSummaryIndex = billingSummary.findIndex(
          (el) => el.summary_name === bVal
        );
        if (billingSummaryIndex > -1) {
          bItem.total_amount = billingSummary[billingSummaryIndex].total_amount;
        }
        billArr.push(bItem);
      });
      bList.push(billArr);
    });
    setBillingList([...bList]);
  };

  useEffect(() => {
    console.log(billingList);
  }, [billingList]);

  // filter
  useEffect(() => {
    setLoading(true);
    dispatch(
      get(
        endpointBilling +
          "/management/billing/graph?range=" +
          range +
          "&tower=" +
          tower,
        (res) => {
          setLoading(false);
          setBillingGraph(res.data.data);
        },
        (err) => {
          // console.log(err.response)
          setLoading(false);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, range, tower]);
  // V1
  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(
  //     get(
  //       endpointBilling +
  //         "/management/billing/statistic?building_id=" +
  //         buildingName +
  //         "&tower=" +
  //         tower,
  //       (res) => {
  //         setLoading(false);
  //         setBillingData(res.data.data);
  //       }
  //     )
  //   );
  // }, [dispatch, tower, buildingName]);

  // V2
  useEffect(() => {
    setLoading(true);
    dispatch(
      get(
        endpointBilling +
          "/management/billing/statisticv2?building_id=" +
          buildingName +
          "&building_section=" +
          tower +
          "&filter=" +
          (periode !== "periode" ? "all" : periode) +
          "&start_date_from=" +
          startDateFrom +
          "&end_date_from=" +
          endDateFrom +
          "&start_date_to=" +
          startDateTo +
          "&end_date_to=" +
          endDateTo +
          "&check=" +
          check,
        (res) => {
          setLoading(false);
          setBillingData(res.data.data);
        }
      )
    );
  }, [dispatch, tower, buildingName, periode, check, refreshToggle]);

  useEffect(() => {
    dispatch(
      get(
        endpointManagement +
          "/admin/staff/statistics?tower=" +
          tower +
          "&building_id=" +
          buildingName,
        (res) => {
          setStaffData(res.data.data);
          if (res.data.data.billing_summary.length > 0) {
            handleBillingSummary(res.data.data.billing_summary);
          }
        }
      )
    );
  }, [dispatch, tower, buildingName]);

  // Unit Statistic
  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/building/unit/data?building_id=" +
          buildingName +
          "&building_section=" +
          tower +
          "&date=" +
          periodeTime +
          // ( periode === "year" ? periodeByYear
          //   :
          //   periode === "month" ? periodeByMonth
          //   :
          //   periode === "day" ? periodeTime
          //   :
          //   periodeByYear
          // ) +
          "&filter=" +
          (periode === "periode" ? "all" : periode),
        (res) => {
          setUnitStatistic(res.data.data);
        }
      )
    );
  }, [
    dispatch,
    tower,
    buildingName,
    periode,
    periodeTime,
    periodeByMonth,
    periodeByYear,
  ]);

  // Staff Statistic
  useEffect(() => {
    dispatch(
      get(
        endpointManagement +
          "/admin/staff/data?building_id=" +
          buildingName +
          "&building_section=" +
          tower +
          "&date=" +
          periodeTime +
          // ( periode === "year" ? periodeByYear
          //   :
          //   periode === "month" ? periodeByMonth
          //   :
          //   periode === "day" ? periodeTime
          //   :
          //   periodeByYear
          // ) +
          "&filter=" +
          (periode === "periode" ? "all" : periode),
        (res) => {
          setStaffStatistic(res.data.data);
        }
      )
    );
  }, [
    dispatch,
    tower,
    buildingName,
    periode,
    periodeTime,
    periodeByMonth,
    periodeByYear,
  ]);

  // Resident Statistic
  useEffect(() => {
    dispatch(
      get(
        endpointResident +
          "/management/resident/data?building_id=" +
          buildingName +
          "&building_section=" +
          tower +
          "&filter=" +
          (periode !== "periode" ? "all" : periode) +
          "&start_date_from=" +
          startDateFrom +
          "&end_date_from=" +
          endDateFrom +
          "&start_date_to=" +
          startDateTo +
          "&end_date_to=" +
          endDateTo +
          "&check=" +
          check,
        (res) => {
          setResidentStatistic(res.data.data);
          setCheck("");
          setLoading(false);
        }
      )
    );
  }, [dispatch, tower, buildingName, periode, check, refreshToggle]);

  useEffect(() => {
    dispatch(
      get(
        endpointManagement + "/admin/notification",
        (res) => {
          dispatch(setNotificationData(res.data.data));
        },
        (err) => console.log(err.response)
      )
    );
  }, [dispatch, tower]);

  useEffect(() => {
    if (auth.role === "bm") {
      const blacklist_modules = auth.user.blacklist_modules;
      const isSecurity = blacklist_modules.find(
        (item) => item.module === "security"
      )
        ? true
        : false;
      const isInternalCourier = blacklist_modules.find(
        (item) => item.module === "internal_courier"
      )
        ? true
        : false;
      const isTechnician = blacklist_modules.find(
        (item) => item.module === "technician"
      )
        ? true
        : false;
      setIsSecurity(isSecurity);
      setIsCourier(isInternalCourier);
      setIsTechnician(isTechnician);
    }
  }, [auth]);

  useEffect(() => {
    if (range === "dtd") {
      const aDaysBefore = new Date().setHours(new Date().getHours() - 24);
      const hoursRange = getDatesRange(
        new Date(aDaysBefore),
        new Date(),
        "hours"
      );
      const finalGraph = hoursRange.map((date) => {
        const data = billingGraph
          ? billingGraph.filter(
              (graph) =>
                graph.date.split("T")[0] +
                  graph.date.split("T")[1].split(":")[0] ===
                date.split(" ")[0] + date.split(" ")[1].split(":")[0]
            )
          : [];
        const day = moment(date).format("dddd");
        const hour = moment(date).format("HH:00");
        return {
          Date: `${day.substring(0, 3)} ${hour}`,
          "Amount Billing": data.reduce((total, data) => {
            return total + data.billing_amount;
          }, 0),
        };
      });
      setBillingGraphFormatted(finalGraph);
    }
    if (range === "mtd") {
      const aMonthBefore = new Date().setDate(new Date().getDate() - 30);
      const datesRange = getDatesRange(
        new Date(aMonthBefore),
        new Date(),
        "days"
      );
      const finalGraph = datesRange.map((date, i) => {
        const data = billingGraph
          ? billingGraph.filter(
              (graph) => graph.date.split("T")[0] === date.split(" ")[0]
            )
          : [];
        let month = moment(date).format("MMM") + " ";
        const d = moment(date).format("D");
        return {
          Date: month + d,
          "Amount Billing": data.reduce((total, data) => {
            return total + data.billing_amount;
          }, 0),
        };
      });
      setBillingGraphFormatted(finalGraph);
    }
    if (range === "ytd") {
      const aYearBefore = new Date().setFullYear(new Date().getFullYear() - 1);
      const monthsRange = getDatesRange(
        new Date(aYearBefore),
        new Date(),
        "months"
      );
      const finalGraph = monthsRange.map((date) => {
        const data = billingGraph
          ? billingGraph.filter(
              (graph) =>
                graph.date.split("T")[0].split("-")[0] +
                  graph.date.split("T")[0].split("-")[1] ===
                date.split(" ")[0].split("-")[0] +
                  date.split(" ")[0].split("-")[1]
            )
          : [];
        const month = moment(date).format("MMM") + " ";
        const year = moment(date).format("YYYY");
        return {
          Date: month + year,
          "Amount Billing": data.reduce((total, data) => {
            return total + data.billing_amount;
          }, 0),
        };
      });
      setBillingGraphFormatted(finalGraph);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingGraph]);

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
            console.log(res);

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

  return (
    <Loading loading={loading}>
      <Modal
        title="Choose Building"
        subtitle="Choose building to set filter"
        isOpen={openModalBuilding}
        toggle={() => setOpenModalBuilding(false)}
        disableFooter="true"
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
        disableFooter="true"
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

      {/* Start of SA Section */}

      {auth.role === "sa" && (
        <>
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
                          <h2 className="mt-3 PageTitle no-wrap">
                            Building Overview
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
          <div className="row no-gutters mt-2">
            <div className="Container-dashboard flex-column">
              <div className="row no-gutters">
                <div
                  className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap"
                  style={{ minWidth: 120 }}
                >
                  Periode Data
                </div>
                <div
                  className="col-sm-2 w-100"
                  style={{ minWidth: 170, marginBottom: 8 }}
                >
                  <InputDash
                    type="select"
                    options={[
                      { label: "Semua Data", value: "all" },
                      { label: "Berdasarkan Tahun", value: "year" },
                      { label: "Berdasarkan Bulan", value: "month" },
                      { label: "Berdasarkan Hari", value: "day" },
                      { label: "Berdasarkan Periode", value: "periode" },
                    ]}
                    inputValue={periode}
                    setInputValue={setPeriode}
                  />
                </div>
                {/* {periode === "periode" ?
              <>
                <div className="col-sm-2" style={{minWidth:150}}>
                    <InputDash type="date" 
                    inputValue={startDateFrom} setInputValue={setStartDateFrom}
                    />
                </div>
                <div className="col-sm-2" style={{minWidth:150}}>
                    <InputDash type="date" 
                    inputValue={endDateFrom} setInputValue={setEndDateFrom}
                    />
                </div>
                <div className="col-sm-2" style={{minWidth:150}}>
                    <InputDash type="date" 
                    inputValue={startDateTo} setInputValue={setStartDateTo}
                    />
                </div>
                <div className="col-sm-2" style={{minWidth:150}}>
                    <InputDash type="date" 
                    inputValue={endDateTo} setInputValue={setEndDateTo}
                    />
                </div>
              </>
              :
              []
            } */}
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
                ) : // <>
                //   <div className="row">
                //     <div className="col-12">
                //       <div className="row" style={{ marginBottom: 8 }}>
                //         <div className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap" style={{minWidth:100}}>
                //             Mulai Dari:
                //         </div>
                //         <div className="col-sm-3" style={{minWidth:150}}>
                //             <InputDash type="date"
                //             inputValue={startDateFrom} setInputValue={setStartDateFrom}
                //             />
                //         </div>
                //         <div className="col-sm-3" style={{minWidth:150}}>
                //             <InputDash type="date"
                //             inputValue={endDateFrom} setInputValue={setEndDateFrom}
                //             />
                //         </div>
                //       </div>
                //     </div>
                //     <div className="col-12">
                //       <div className="row">
                //         <div className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap" style={{minWidth:100}}>
                //             Sampai:
                //         </div>
                //         <div className="col-sm-3" style={{minWidth:150}}>
                //             <InputDash type="date"
                //             inputValue={startDateTo} setInputValue={setStartDateTo}
                //             />
                //         </div>
                //         <div className="col-sm-3" style={{minWidth:150}}>
                //             <InputDash type="date"
                //             inputValue={endDateTo} setInputValue={setEndDateTo}
                //             />
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // </>
                periode === "month" ? (
                  <div className="col-sm-2" style={{ minWidth: 150 }}>
                    <InputDash
                      type="date"
                      inputValue={periodeTime}
                      setInputValue={setPeriodeTime}
                    />
                  </div>
                ) : periode === "periode" ? (
                  <>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div
                            className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap"
                            style={{ minWidth: 120 }}
                          >
                            Periode Sekarang
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 150 }}>
                            <InputDash
                              type="date"
                              inputValue={startDateTo}
                              setInputValue={setStartDateTo}
                            />
                          </div>
                          <div
                            className="col-sm-1 mt-1 mr-5 text-nowrap"
                            style={{ maxWidth: 10 }}
                          >
                            s/d
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 150 }}>
                            <InputDash
                              type="date"
                              inputValue={endDateTo}
                              setInputValue={setEndDateTo}
                            />
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 150 }}>
                            <Button
                              className="ButtonNew"
                              color="Primary"
                              label="Search"
                              onClick={() => {
                                setCheck("yes");
                                setLoading(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row" style={{ marginBottom: 8 }}>
                          <div
                            className="col-sm-1 mt-1 ml-3 mr-1 text-nowrap"
                            style={{ minWidth: 120 }}
                          >
                            Periode Lalu
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 150 }}>
                            <InputDash
                              type="date"
                              inputValue={startDateFrom}
                              setInputValue={setStartDateFrom}
                            />
                          </div>
                          <div
                            className="col-sm-1 mt-1 mr-5 text-nowrap"
                            style={{ maxWidth: 10 }}
                          >
                            s/d
                          </div>
                          <div className="col-sm-3" style={{ minWidth: 150 }}>
                            <InputDash
                              type="date"
                              inputValue={endDateFrom}
                              setInputValue={setEndDateFrom}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
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
            <div className="Container-dashboard flex-column">
              <div className="col mt-2">
                <h5>Building Statistics</h5>
              </div>
              <TabDashboard
                labels={tabs}
                setTab={setType}
                activeTab={0}
                contents={[
                  <>
                    <div className="row no-gutters">
                      {auth.role === "sa" && (
                        <div className="col">
                          <div
                            className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer"
                            onClick={() => {
                              history.push("/" + auth.role + "/building");
                            }}
                          >
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Group 2311.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Total Building
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={staffData.num_of_building}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      // value={unitStatistic.registered_unit_previous}
                                      value={0}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {
                                        // unitStatistic.registered_unit_previous !== 0 ?
                                        // decimal((((unitStatistic.registered_unit)-unitStatistic.registered_unit_previous)/unitStatistic.registered_unit_previous)*100)
                                        // :
                                        0
                                      }
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="col">
                        {auth.role === "sa" && (
                          <div
                            className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer"
                            onClick={() => {
                              auth.role === "bm"
                                ? history.push(
                                    "/" +
                                      auth.role +
                                      "/building/" +
                                      auth.user.building_id,
                                    { tab: 2 }
                                  )
                                : history.push("/" + auth.role + "/building");
                            }}
                          >
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Total Unit 2.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Total Unit
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={unitStatistic.registered_unit}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        unitStatistic.registered_unit_previous
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {unitStatistic.registered_unit_previous !==
                                    0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((unitStatistic.registered_unit -
                                              unitStatistic.registered_unit_previous) /
                                              unitStatistic.registered_unit_previous) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((unitStatistic.registered_unit -
                                          unitStatistic.registered_unit_previous) /
                                          unitStatistic.registered_unit_previous) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((unitStatistic.registered_unit -
                                            unitStatistic.registered_unit_previous) /
                                            unitStatistic.registered_unit_previous) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((unitStatistic.registered_unit -
                                          unitStatistic.registered_unit_previous) /
                                          unitStatistic.registered_unit_previous) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((unitStatistic.registered_unit -
                                                unitStatistic.registered_unit_previous) /
                                                unitStatistic.registered_unit_previous) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (unitStatistic.registered_unit -
                                              unitStatistic.registered_unit_previous) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((unitStatistic.registered_unit -
                                                unitStatistic.registered_unit_previous) /
                                                unitStatistic.registered_unit_previous) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (unitStatistic.registered_unit -
                                              unitStatistic.registered_unit_previous) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {auth.role === "sa" && (
                        <>
                          <div className="col">
                            <div
                              className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer"
                              onClick={() => {
                                history.push("/" + auth.role + "/building");
                              }}
                            >
                              <div
                                className="row no-gutters align-items-center"
                                style={{ minWidth: 220 }}
                              >
                                <div className="col-auto">
                                  <div className="w-auto">
                                    <img
                                      alt=""
                                      src={require("./../../assets/Average Unit 3.jpg")}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="text-nowrap ml-3">
                                    Average Unit
                                  </div>
                                  <AnimatedNumber
                                    className="h2 font-weight-bold black ml-3"
                                    value={
                                      unitStatistic.registered_unit /
                                        staffData.num_of_building +
                                      ""
                                    }
                                    // value={
                                    //   staffData.num_of_unit / staffData.num_of_building + ""
                                    // }
                                    formatValue={formatValue}
                                  />
                                </div>
                              </div>
                              {periode !== "all" && (
                                <div className="row no-gutters align-items-center mt-2">
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
                                        value={
                                          unitStatistic.registered_unit_previous /
                                          staffData.num_of_building
                                        }
                                        formatValue={formatValue}
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div
                                      style={{ fontSize: 12 }}
                                      className="text-nowrap ml-3 text-right"
                                    >
                                      {unitStatistic.registered_unit_previous /
                                        staffData.num_of_building !==
                                      0 ? (
                                        <font
                                          style={{
                                            color: `${
                                              ((unitStatistic.registered_unit /
                                                staffData.num_of_building -
                                                unitStatistic.registered_unit_previous /
                                                  staffData.num_of_building) /
                                                (unitStatistic.registered_unit_previous /
                                                  staffData.num_of_building)) *
                                                100 <
                                              0
                                                ? "#E12029"
                                                : "#52A452"
                                            }`,
                                          }}
                                        >
                                          {((unitStatistic.registered_unit /
                                            staffData.num_of_building -
                                            unitStatistic.registered_unit_previous /
                                              staffData.num_of_building) /
                                            (unitStatistic.registered_unit_previous /
                                              staffData.num_of_building)) *
                                            100 <
                                          0 ? (
                                            <FiChevronUp
                                              style={{
                                                transform: "rotate(180deg)",
                                                marginBottom: "6px",
                                              }}
                                            />
                                          ) : ((unitStatistic.registered_unit /
                                              staffData.num_of_building -
                                              unitStatistic.registered_unit_previous /
                                                staffData.num_of_building) /
                                              (unitStatistic.registered_unit_previous /
                                                staffData.num_of_building)) *
                                              100 >
                                            0 ? (
                                            <FiChevronUp
                                              style={{ marginBottom: "6px" }}
                                            />
                                          ) : (
                                            []
                                          )}
                                          {((unitStatistic.registered_unit /
                                            staffData.num_of_building -
                                            unitStatistic.registered_unit_previous /
                                              staffData.num_of_building) /
                                            (unitStatistic.registered_unit_previous /
                                              staffData.num_of_building)) *
                                            100 <
                                          0
                                            ? " " +
                                              decimal(
                                                ((unitStatistic.registered_unit /
                                                  staffData.num_of_building -
                                                  unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building) /
                                                  (unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building)) *
                                                  100
                                              ) *
                                                -1 +
                                              "%" +
                                              " ( -" +
                                              formatValue(
                                                unitStatistic.registered_unit /
                                                  staffData.num_of_building -
                                                  (unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building) *
                                                    -1
                                              ) +
                                              " )"
                                            : " " +
                                              decimal(
                                                ((unitStatistic.registered_unit /
                                                  staffData.num_of_building -
                                                  unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building) /
                                                  (unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building)) *
                                                  100
                                              ) +
                                              "%" +
                                              " ( +" +
                                              formatValue(
                                                unitStatistic.registered_unit /
                                                  staffData.num_of_building -
                                                  unitStatistic.registered_unit_previous /
                                                    staffData.num_of_building
                                              ) +
                                              " )"}
                                        </font>
                                      ) : (
                                        <font style={{ color: "#52A452" }}>
                                          0%
                                        </font>
                                      )}
                                      {/* <font style={{color:"#52A452"}}>
                                        {
                                        (unitStatistic.registered_unit_previous / staffData.num_of_building) !== 0 ?
                                        decimal((((unitStatistic.registered_unit / staffData.num_of_building)-(unitStatistic.registered_unit_previous / staffData.num_of_building))/(unitStatistic.registered_unit_previous / staffData.num_of_building))*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col">
                            <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                              <div
                                className="row no-gutters align-items-center"
                                style={{ minWidth: 220 }}
                              >
                                <div className="col-auto">
                                  <div className="w-auto">
                                    <img
                                      alt=""
                                      src={require("./../../assets/Onboarding Unit 2.jpg")}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="text-nowrap ml-3">
                                    Occupied Unit
                                  </div>
                                  <AnimatedNumber
                                    className="h2 font-weight-bold black ml-3"
                                    value={unitStatistic.onboard_unit}
                                    // value={staffData.num_of_onboarded_unit}
                                    formatValue={formatValue}
                                  />
                                </div>
                              </div>
                              {periode !== "all" && (
                                <div className="row no-gutters align-items-center mt-2">
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
                                        value={
                                          unitStatistic.onboard_unit_previous
                                        }
                                        formatValue={formatValue}
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div
                                      style={{ fontSize: 12 }}
                                      className="text-nowrap ml-3 text-right"
                                    >
                                      {unitStatistic.onboard_unit_previous !==
                                      0 ? (
                                        <font
                                          style={{
                                            color: `${
                                              ((unitStatistic.onboard_unit -
                                                unitStatistic.onboard_unit_previous) /
                                                unitStatistic.onboard_unit_previous) *
                                                100 <
                                              0
                                                ? "#E12029"
                                                : "#52A452"
                                            }`,
                                          }}
                                        >
                                          {((unitStatistic.onboard_unit -
                                            unitStatistic.onboard_unit_previous) /
                                            unitStatistic.onboard_unit_previous) *
                                            100 <
                                          0 ? (
                                            <FiChevronUp
                                              style={{
                                                transform: "rotate(180deg)",
                                                marginBottom: "6px",
                                              }}
                                            />
                                          ) : ((unitStatistic.onboard_unit -
                                              unitStatistic.onboard_unit_previous) /
                                              unitStatistic.onboard_unit_previous) *
                                              100 >
                                            0 ? (
                                            <FiChevronUp
                                              style={{ marginBottom: "6px" }}
                                            />
                                          ) : (
                                            []
                                          )}
                                          {((unitStatistic.onboard_unit -
                                            unitStatistic.onboard_unit_previous) /
                                            unitStatistic.onboard_unit_previous) *
                                            100 <
                                          0
                                            ? " " +
                                              decimal(
                                                ((unitStatistic.onboard_unit -
                                                  unitStatistic.onboard_unit_previous) /
                                                  unitStatistic.onboard_unit_previous) *
                                                  100
                                              ) *
                                                -1 +
                                              "%" +
                                              " ( -" +
                                              (unitStatistic.onboard_unit -
                                                unitStatistic.onboard_unit_previous) +
                                              " )"
                                            : " " +
                                              decimal(
                                                ((unitStatistic.onboard_unit -
                                                  unitStatistic.onboard_unit_previous) /
                                                  unitStatistic.onboard_unit_previous) *
                                                  100
                                              ) +
                                              "%" +
                                              " ( +" +
                                              (unitStatistic.onboard_unit -
                                                unitStatistic.onboard_unit_previous) +
                                              " )"}
                                        </font>
                                      ) : (
                                        <font style={{ color: "#52A452" }}>
                                          0%
                                        </font>
                                      )}
                                      {/* <font style={{color:"#52A452"}}>
                                        {
                                        unitStatistic.onboard_unit_previous !== 0 ?
                                        decimal((((unitStatistic.onboard_unit)-unitStatistic.onboard_unit_previous)/unitStatistic.onboard_unit_previous)*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {auth.role !== "sa" && (
                        <>
                          <div className="col">
                            <div className="Container color-7 d-flex flex-column cursor-pointer">
                              <div
                                className="row no-gutters align-items-center"
                                style={{ minWidth: 220 }}
                              >
                                <div className="col">
                                  <AnimatedNumber
                                    className="h2 font-weight-bold white"
                                    // value={staffStatistic.num_of_login_staff}
                                    value={staffData.num_of_login_staff}
                                    formatValue={formatValue}
                                  />
                                  <div className="text-nowrap">
                                    Online Staff(s)
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="w-auto">
                                    <RiUserStarLine className="BigIcon white my-0" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {auth.role !== "sa" && (
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="Container color-6 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col">
                                <AnimatedNumber
                                  className="h2 font-weight-bold white"
                                  // value={residentStatistic.online_resident + residentStatistic.online_resident_basic}
                                  value={staffData.num_of_login_resident}
                                  formatValue={formatValue}
                                />
                                <div className="text-nowrap">
                                  Online Resident(s)
                                </div>
                              </div>
                              <div className="col-auto">
                                <div className="w-auto">
                                  <RiUserFollowLine className="BigIcon white my-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col">
                          <div className="Container color-6 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col">
                                <AnimatedNumber
                                  className="h2 font-weight-bold white"
                                  value={staffData.num_of_login_unit}
                                  formatValue={formatValue}
                                />
                                <div className="text-nowrap">
                                  Online Unit(s)
                                </div>
                              </div>
                              <div className="col-auto">
                                <div className="w-auto">
                                  <RiBuilding4Line className="BigIcon white my-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className="col">
                          <div className="Container color-8 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col">
                                <AnimatedNumber
                                  className="h2 font-weight-bold white"
                                  // value={(residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)}
                                  value={staffData.num_of_onboarded_resident}
                                  formatValue={formatValue}
                                />
                                <div className="text-nowrap">
                                  Onboarded Resident(s)
                                </div>
                              </div>
                              <div className="col-auto">
                                <div className="w-auto">
                                  <RiUserLocationLine className="BigIcon white my-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container color-8 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col">
                                <AnimatedNumber
                                  className="h2 font-weight-bold white"
                                  // value={unitStatistic.onboard_unit}
                                  value={staffData.num_of_onboarded_unit}
                                  formatValue={formatValue}
                                />
                                <div className="text-nowrap">
                                  Occupied Unit(s)
                                </div>
                              </div>
                              <div className="col-auto">
                                <div className="w-auto">
                                  <RiBuilding4Line className="BigIcon white my-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {auth.role === "sa" && (
                      <div class="row no-gutters">
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Online Staff 1.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Total Staff
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={staffStatistic.registered_staff}
                                  // value={staffData.num_of_login_staff}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        staffStatistic.registered_staff_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {staffStatistic.registered_staff !== 0 &&
                                    periode !== "periode" ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) /
                                              staffStatistic.registered_staff_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((staffStatistic.registered_staff -
                                          staffStatistic.registered_staff_prev) /
                                          staffStatistic.registered_staff_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((staffStatistic.registered_staff -
                                            staffStatistic.registered_staff_prev) /
                                            staffStatistic.registered_staff_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((staffStatistic.registered_staff -
                                          staffStatistic.registered_staff_prev) /
                                          staffStatistic.registered_staff_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((staffStatistic.registered_staff -
                                                staffStatistic.registered_staff_prev) /
                                                staffStatistic.registered_staff_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((staffStatistic.registered_staff -
                                                staffStatistic.registered_staff_prev) /
                                                staffStatistic.registered_staff_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                      {
                                      staffStatistic.registered_staff !== 0 ?
                                      decimal((((staffStatistic.registered_staff)-staffStatistic.registered_staff_prev)/staffStatistic.registered_staff_prev)*100)
                                      :
                                      0
                                      }%
                                    </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Online Staff 1.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Onboarded Staff
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={staffStatistic.registered_staff}
                                  // value={staffData.num_of_login_staff}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        staffStatistic.registered_staff_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {staffStatistic.registered_staff !== 0 &&
                                    periode !== "periode" ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) /
                                              staffStatistic.registered_staff_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((staffStatistic.registered_staff -
                                          staffStatistic.registered_staff_prev) /
                                          staffStatistic.registered_staff_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((staffStatistic.registered_staff -
                                            staffStatistic.registered_staff_prev) /
                                            staffStatistic.registered_staff_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((staffStatistic.registered_staff -
                                          staffStatistic.registered_staff_prev) /
                                          staffStatistic.registered_staff_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((staffStatistic.registered_staff -
                                                staffStatistic.registered_staff_prev) /
                                                staffStatistic.registered_staff_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((staffStatistic.registered_staff -
                                                staffStatistic.registered_staff_prev) /
                                                staffStatistic.registered_staff_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (staffStatistic.registered_staff -
                                              staffStatistic.registered_staff_prev) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        staffStatistic.registered_staff !== 0 ?
                                        decimal((((staffStatistic.registered_staff)-staffStatistic.registered_staff_prev)/staffStatistic.registered_staff_prev)*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Online Staff 1.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Total Open PO
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={residentStatistic.open_po}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={residentStatistic.open_po_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {residentStatistic.open_po_prev !== 0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((residentStatistic.open_po -
                                              residentStatistic.open_po_prev) /
                                              residentStatistic.open_po_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((residentStatistic.open_po -
                                          residentStatistic.open_po_prev) /
                                          residentStatistic.open_po_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((residentStatistic.open_po -
                                            residentStatistic.open_po_prev) /
                                            residentStatistic.open_po_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((residentStatistic.open_po -
                                          residentStatistic.open_po_prev) /
                                          residentStatistic.open_po_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((residentStatistic.open_po -
                                                residentStatistic.open_po_prev) /
                                                residentStatistic.open_po_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (residentStatistic.open_po -
                                              residentStatistic.open_po_prev) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((residentStatistic.open_po -
                                                residentStatistic.open_po_prev) /
                                                residentStatistic.open_po_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (residentStatistic.open_po -
                                              residentStatistic.open_po_prev) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        staffStatistic.registered_staff !== 0 ?
                                        decimal((((staffStatistic.registered_staff)-staffStatistic.registered_staff_prev)/staffStatistic.registered_staff_prev)*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Online Staff 1.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Active Open PO
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={residentStatistic.active_open_po}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        residentStatistic.active_open_po_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {residentStatistic.active_open_po_prev !==
                                    0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((residentStatistic.active_open_po -
                                              residentStatistic.active_open_po_prev) /
                                              residentStatistic.active_open_po_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((residentStatistic.active_open_po -
                                          residentStatistic.active_open_po_prev) /
                                          residentStatistic.active_open_po_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((residentStatistic.active_open_po -
                                            residentStatistic.active_open_po_prev) /
                                            residentStatistic.active_open_po_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((residentStatistic.active_open_po -
                                          residentStatistic.active_open_po_prev) /
                                          residentStatistic.active_open_po_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((residentStatistic.active_open_po -
                                                residentStatistic.active_open_po_prev) /
                                                residentStatistic.active_open_po_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (residentStatistic.active_open_po -
                                              residentStatistic.active_open_po_prev) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((residentStatistic.active_open_po -
                                                residentStatistic.active_open_po_prev) /
                                                residentStatistic.active_open_po_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (residentStatistic.active_open_po -
                                              residentStatistic.active_open_po_prev) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        staffStatistic.registered_staff !== 0 ?
                                        decimal((((staffStatistic.registered_staff)-staffStatistic.registered_staff_prev)/staffStatistic.registered_staff_prev)*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>,
                  <>
                    {auth.role === "sa" && (
                      <div class="row no-gutters">
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Resident.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Registered Resident
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={residentStatistic.registered_resident}
                                  // value={staffData.num_of_onboarded_resident}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        residentStatistic.registered_resident_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {residentStatistic.registered_resident_prev !==
                                    0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((residentStatistic.registered_resident -
                                              residentStatistic.registered_resident_prev) /
                                              residentStatistic.registered_resident_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((residentStatistic.registered_resident -
                                          residentStatistic.registered_resident_prev) /
                                          residentStatistic.registered_resident_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((residentStatistic.registered_resident -
                                            residentStatistic.registered_resident_prev) /
                                            residentStatistic.registered_resident_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((residentStatistic.registered_resident -
                                          residentStatistic.registered_resident_prev) /
                                          residentStatistic.registered_resident_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((residentStatistic.registered_resident -
                                                residentStatistic.registered_resident_prev) /
                                                residentStatistic.registered_resident_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (unitStatistic.registered_unit -
                                              unitStatistic.registered_unit_previous) +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((residentStatistic.registered_resident -
                                                residentStatistic.registered_resident_prev) /
                                                residentStatistic.registered_resident_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (unitStatistic.registered_unit -
                                              unitStatistic.registered_unit_previous) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        (residentStatistic.registered_resident_prev) !== 0 ?
                                        decimal((residentStatistic.registered_resident-residentStatistic.registered_resident_prev/residentStatistic.registered_resident_prev)*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Online Resident.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Online Resident
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={
                                    buildingName != "" ? residentStatistic.online_resident : residentStatistic.online_resident +
                                    residentStatistic.online_resident_basic
                                  }
                                  // value={staffData.num_of_login_resident}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        buildingName != "" ? residentStatistic.online_resident_prev : residentStatistic.online_resident_prev +
                                        residentStatistic.online_resident_basic_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {residentStatistic.online_resident_prev +
                                      residentStatistic.online_resident_basic_prev !==
                                    0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((residentStatistic.online_resident +
                                              residentStatistic.online_resident_basic -
                                              (residentStatistic.online_resident_prev +
                                                residentStatistic.online_resident_basic_prev)) /
                                              (residentStatistic.online_resident_prev +
                                                residentStatistic.online_resident_basic_prev)) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((residentStatistic.online_resident +
                                          residentStatistic.online_resident_basic -
                                          (residentStatistic.online_resident_prev +
                                            residentStatistic.online_resident_basic_prev)) /
                                          (residentStatistic.online_resident_prev +
                                            residentStatistic.online_resident_basic_prev)) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((residentStatistic.online_resident +
                                            residentStatistic.online_resident_basic -
                                            (residentStatistic.online_resident_prev +
                                              residentStatistic.online_resident_basic_prev)) /
                                            (residentStatistic.online_resident_prev +
                                              residentStatistic.online_resident_basic_prev)) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((residentStatistic.online_resident +
                                          residentStatistic.online_resident_basic -
                                          (residentStatistic.online_resident_prev +
                                            residentStatistic.online_resident_basic_prev)) /
                                          (residentStatistic.online_resident_prev +
                                            residentStatistic.online_resident_basic_prev)) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((residentStatistic.online_resident +
                                                residentStatistic.online_resident_basic -
                                                (residentStatistic.online_resident_prev +
                                                  residentStatistic.online_resident_basic_prev)) /
                                                (residentStatistic.online_resident_prev +
                                                  residentStatistic.online_resident_basic_prev)) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (residentStatistic.online_resident +
                                              residentStatistic.online_resident_basic -
                                              (residentStatistic.online_resident_prev +
                                                residentStatistic.online_resident_basic_prev)) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((residentStatistic.online_resident +
                                                residentStatistic.online_resident_basic -
                                                (residentStatistic.online_resident_prev +
                                                  residentStatistic.online_resident_basic_prev)) /
                                                (residentStatistic.online_resident_prev +
                                                  residentStatistic.online_resident_basic_prev)) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (residentStatistic.online_resident +
                                              residentStatistic.online_resident_basic -
                                              (residentStatistic.online_resident_prev +
                                                residentStatistic.online_resident_basic_prev)) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        (residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev) !== 0 ?
                                        decimal((((residentStatistic.online_resident + residentStatistic.online_resident_basic)-(residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev))/(residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev))*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                            <div
                              className="row no-gutters align-items-center"
                              style={{ minWidth: 220 }}
                            >
                              <div className="col-auto">
                                <div className="w-auto">
                                  <img
                                    alt=""
                                    src={require("./../../assets/Onboarding Resident.jpg")}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="text-nowrap ml-3">
                                  Onboarded Resident
                                </div>
                                <AnimatedNumber
                                  className="h2 font-weight-bold black ml-3"
                                  value={
                                    residentStatistic.onboard_resident +
                                    residentStatistic.onboard_resident_basic
                                  }
                                  // value={staffData.num_of_onboarded_resident}
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mt-2">
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
                                      value={
                                        residentStatistic.onboard_resident_prev +
                                        residentStatistic.onboard_resident_basic_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3 text-right"
                                  >
                                    {residentStatistic.onboard_resident_prev +
                                      residentStatistic.onboard_resident_basic_prev !==
                                    0 ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((residentStatistic.onboard_resident +
                                              residentStatistic.onboard_resident_basic -
                                              (residentStatistic.onboard_resident_prev +
                                                residentStatistic.onboard_resident_basic_prev)) /
                                              (residentStatistic.onboard_resident_prev +
                                                residentStatistic.onboard_resident_basic_prev)) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((residentStatistic.onboard_resident +
                                          residentStatistic.onboard_resident_basic -
                                          (residentStatistic.onboard_resident_prev +
                                            residentStatistic.onboard_resident_basic_prev)) /
                                          (residentStatistic.onboard_resident_prev +
                                            residentStatistic.onboard_resident_basic_prev)) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((residentStatistic.onboard_resident +
                                            residentStatistic.onboard_resident_basic -
                                            (residentStatistic.onboard_resident_prev +
                                              residentStatistic.onboard_resident_basic_prev)) /
                                            (residentStatistic.onboard_resident_prev +
                                              residentStatistic.onboard_resident_basic_prev)) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((residentStatistic.onboard_resident +
                                          residentStatistic.onboard_resident_basic -
                                          (residentStatistic.onboard_resident_prev +
                                            residentStatistic.onboard_resident_basic_prev)) /
                                          (residentStatistic.onboard_resident_prev +
                                            residentStatistic.onboard_resident_basic_prev)) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((residentStatistic.onboard_resident +
                                                residentStatistic.onboard_resident_basic -
                                                (residentStatistic.onboard_resident_prev +
                                                  residentStatistic.onboard_resident_basic_prev)) /
                                                (residentStatistic.onboard_resident_prev +
                                                  residentStatistic.onboard_resident_basic_prev)) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (residentStatistic.onboard_resident +
                                              residentStatistic.onboard_resident_basic -
                                              (residentStatistic.onboard_resident_prev +
                                                residentStatistic.onboard_resident_basic_prev)) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((residentStatistic.onboard_resident +
                                                residentStatistic.onboard_resident_basic -
                                                (residentStatistic.onboard_resident_prev +
                                                  residentStatistic.onboard_resident_basic_prev)) /
                                                (residentStatistic.onboard_resident_prev +
                                                  residentStatistic.onboard_resident_basic_prev)) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (residentStatistic.onboard_resident +
                                              residentStatistic.onboard_resident_basic -
                                              (residentStatistic.onboard_resident_prev +
                                                residentStatistic.onboard_resident_basic_prev)) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>
                                        0%
                                      </font>
                                    )}
                                    {/* <font style={{color:"#52A452"}}>
                                        {
                                        (residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev) !== 0 ?
                                        decimal((((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100)
                                        :
                                        0
                                        }%
                                      </font> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>,
                ]}
              />
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-12">
              <div className="row no-gutters">
                <div className="col-8">
                  <div className="Container-dashboard flex-column">
                    <BarChartDMYAdm
                      headTitle="Billing Statistics"
                      dataChart={billingGraphFormatted}
                      range={range}
                      setRange={setRange}
                      tower={tower}
                      setTower={setTower}
                      buildingName={buildingName}
                      setBuildingName={setBuildingName}
                      buildingLabel={buildingLabel}
                      setBuildingLabel={setBuildingLabel}
                      unitLabel={unitLabel}
                      setUnitLabel={setUnitLabel}
                      dataY={["Amount Billing"]}
                      dataX={["Date"]}
                      barClick={() => {
                        history.push("/" + auth.role + "/billing/unit");
                      }}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div
                    className={
                      auth.role !== "sa"
                        ? "col-6 mr-0 pr-0"
                        : "col-12 mr-0 pr-0"
                    }
                  >
                    <div
                      className="Container-dashboard cursor-pointer flex-column"
                      style={{
                        // marginLeft: 16,
                        marginRight: 0,
                        fontSize: 12,
                      }}
                      onClick={() => {
                        history.push("/" + auth.role + "/billing/settlement");
                      }}
                    >
                      <div className="col-12">
                        <div
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderBottom: "1px solid #f3f3fa",
                            minHeight: 76,
                            maxHeight: 76,
                          }}
                        >
                          <div className="row">
                            <div className="col">
                              <b>Paid Amount Billings</b>
                            </div>
                            <div className="col BigNumber2 text-right">
                              {" "}
                              {typeof billingData.total_paid_amount !==
                                "undefined" &&
                              billingData.total_paid_amount !== null
                                ? formatValuetoMoney(
                                    billingData.total_paid_amount
                                  )
                                : 0}
                            </div>
                          </div>
                          {periode !== "all" && (
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col">
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
                                </div>
                              </div>
                              <div className="col BigNumber2 text-right">
                                  <AnimatedNumber
                                      className="font-weight-bold black"
                                      value={billingData.total_paid_amount_prev}
                                      formatValue={formatValuetoMoney}
                                    />
		                             </div>
                             
                            </div>
                          )}
                          <div className="row">
                          <div className="col text-right">
                                {billingData.total_paid_amount_prev !== 0 &&
                                periode === "periode" ? (
                                  <font
                                    style={{
                                      color: `${
                                        ((billingData.total_paid_amount -
                                          billingData.total_paid_amount_prev) /
                                          billingData.total_paid_amount_prev) *
                                          100 <
                                        0
                                          ? "#E12029"
                                          : "#52A452"
                                      }`,
                                    }}
                                  >
                                    {((billingData.total_paid_amount -
                                      billingData.total_paid_amount_prev) /
                                      billingData.total_paid_amount_prev) *
                                      100 <
                                    0 ? (
                                      <FiChevronUp
                                        style={{
                                          transform: "rotate(180deg)",
                                          marginBottom: "6px",
                                        }}
                                      />
                                    ) : ((billingData.total_paid_amount -
                                        billingData.total_paid_amount_prev) /
                                        billingData.total_paid_amount_prev) *
                                        100 >
                                      0 ? (
                                      <FiChevronUp
                                        style={{ marginBottom: "6px" }}
                                      />
                                    ) : (
                                      []
                                    )}
                                    {((billingData.total_paid_amount -
                                      billingData.total_paid_amount_prev) /
                                      billingData.total_paid_amount_prev) *
                                      100 <
                                    0
                                      ? " " +
                                        decimal(
                                          ((billingData.total_paid_amount -
                                            billingData.total_paid_amount_prev) /
                                            billingData.total_paid_amount_prev) *
                                            100 *
                                            -1
                                        ) +
                                        "%" +
                                        " ( -" +
                                        (billingData.total_paid_amount -
                                          billingData.total_paid_amount_prev) *
                                          -1 +
                                        " )"
                                      : " " +
                                        decimal(
                                          ((billingData.total_paid_amount -
                                            billingData.total_paid_amount_prev) /
                                            billingData.total_paid_amount_prev) *
                                            100
                                        ) +
                                        "%" +
                                        " ( +" +
                                        (billingData.total_paid_amount -
                                          billingData.total_paid_amount_prev) +
                                        " )"}
                                  </font>
                                ) : (
                                  <font style={{ color: "#52A452" }}>0%</font>
                                )}
                              </div>
                          </div>
                          {/*                         
                        {
                            typeof billingData.total_paid_amount !== 'undefined' && billingData.total_paid_amount !== null ?
                            //  formatValuetoMoney(billingData.total_paid_amount) 
                        <div className="col-6 pull-right"> 

                            <AnimatedNumber
                              className="BigNumber2"
                              value={billingData.total_paid_amount}
                              formatValue={formatValuetoMoney}
                            />
                        </div>
                            : 
                            0
                          } */}
                        </div>
                        <div
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderBottom: "1px solid #f3f3fa",
                            minHeight: 76,
                            maxHeight: 76,
                          }}
                        >
                          <div className="row">
                            <div className="col">
                              <b>Unpaid Amount Billing</b>
                            </div>
                            <div className="col BigNumber2 text-right">
                              {" "}
                              {typeof billingData.total_unpaid_amount !==
                                "undefined" &&
                              billingData.total_unpaid_amount !== null
                                ? formatValuetoMoney(
                                    billingData.total_unpaid_amount
                                  )
                                : 0}
                            </div>
                          </div>
                          {periode !== "all" && (
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col">
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
                                </div>
                              </div>
                              <div className="col BigNumber2 text-right">
                                <AnimatedNumber
                                  className="font-weight-bold black"
                                  value={billingData.total_unpaid_amount_prev}
                                  formatValue={formatValuetoMoney}
                                />
                              </div>
                            </div>
                          )}
                          <div className="row">
                          <div className="col text-right">
                                {billingData.total_unpaid_amount_prev !== 0 &&
                                periode === "periode" ? (
                                  <font
                                    style={{
                                      color: `${
                                        ((billingData.total_unpaid_amount -
                                          billingData.total_unpaid_amount_prev) /
                                          billingData.total_unpaid_amount_prev) *
                                          100 <
                                        0
                                          ? "#E12029"
                                          : "#52A452"
                                      }`,
                                    }}
                                  >
                                    {((billingData.total_unpaid_amount -
                                      billingData.total_unpaid_amount_prev) /
                                      billingData.total_unpaid_amount_prev) *
                                      100 <
                                    0 ? (
                                      <FiChevronUp
                                        style={{
                                          transform: "rotate(180deg)",
                                          marginBottom: "6px",
                                        }}
                                      />
                                    ) : ((billingData.total_unpaid_amount -
                                        billingData.total_unpaid_amount_prev) /
                                        billingData.total_unpaid_amount_prev) *
                                        100 >
                                      0 ? (
                                      <FiChevronUp
                                        style={{ marginBottom: "6px" }}
                                      />
                                    ) : (
                                      []
                                    )}
                                    {((billingData.total_unpaid_amount -
                                      billingData.total_unpaid_amount_prev) /
                                      billingData.total_unpaid_amount_prev) *
                                      100 <
                                    0
                                      ? " " +
                                        decimal(
                                          ((billingData.total_unpaid_amount -
                                            billingData.total_unpaid_amount_prev) /
                                            billingData.total_unpaid_amount_prev) *
                                            100 *
                                            -1
                                        ) +
                                        "%" +
                                        " ( -" +
                                        (billingData.total_unpaid_amount -
                                          billingData.total_unpaid_amount_prev) *
                                          -1 +
                                        " )"
                                      : " " +
                                        decimal(
                                          ((billingData.total_unpaid_amount -
                                            billingData.total_unpaid_amount_prev) /
                                            billingData.total_unpaid_amount_prev) *
                                            100
                                        ) +
                                        "%" +
                                        " ( +" +
                                        (billingData.total_unpaid_amount -
                                          billingData.total_unpaid_amount_prev) +
                                        " )"}
                                  </font>
                                ) : (
                                  <font style={{ color: "#52A452" }}>0%</font>
                                )}
                              </div>
                          </div>
                          {/*                         
                        {
                            typeof billingData.total_paid_amount !== 'undefined' && billingData.total_paid_amount !== null ?
                            //  formatValuetoMoney(billingData.total_paid_amount) 
                        <div className="col-6 pull-right"> 

                            <AnimatedNumber
                              className="BigNumber2"
                              value={billingData.total_paid_amount}
                              formatValue={formatValuetoMoney}
                            />
                        </div>
                            : 
                            0
                          } */}
                        </div>
                        <div
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderBottom: "1px solid #f3f3fa",
                            minHeight: 76,
                            maxHeight: 76,
                          }}
                        >
                          <div className="row">
                            <div className="col">
                              <b>Settled Amount Billing</b>
                            </div>
                            <div className="col BigNumber2 text-right">
                              {" "}
                              {typeof billingData.total_settle_amount !==
                                "undefined" &&
                              billingData.total_settle_amount !== null
                                ? formatValuetoMoney(
                                    billingData.total_settle_amount
                                  )
                                : 0}
                            </div>
                          </div>
                          {periode !== "all" && (
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col">
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
                                  
                                </div>
                               
                              </div>
                              <div className="col BigNumber2 text-right">
                                  <AnimatedNumber
                                    className="font-weight-bold black"
                                    value={billingData.total_settle_amount_prev}
                                    formatValue={formatValuetoMoney}
                                  />
                                  </div>
                              
                              
                            </div>
                          )}
                          <div className="row">
                              <div className="col text-right">
                                    {billingData.total_settle_amount_prev !== 0 &&
                                    periode === "periode" ? (
                                      <font
                                        style={{
                                          color: `${
                                            ((billingData.total_settle_amount -
                                              billingData.total_settle_amount_prev) /
                                              billingData.total_settle_amount_prev) *
                                              100 <
                                            0
                                              ? "#E12029"
                                              : "#52A452"
                                          }`,
                                        }}
                                      >
                                        {((billingData.total_settle_amount -
                                          billingData.total_settle_amount_prev) /
                                          billingData.total_settle_amount_prev) *
                                          100 <
                                        0 ? (
                                          <FiChevronUp
                                            style={{
                                              transform: "rotate(180deg)",
                                              marginBottom: "6px",
                                            }}
                                          />
                                        ) : ((billingData.total_settle_amount -
                                            billingData.total_settle_amount_prev) /
                                            billingData.total_settle_amount_prev) *
                                            100 >
                                          0 ? (
                                          <FiChevronUp
                                            style={{ marginBottom: "6px" }}
                                          />
                                        ) : (
                                          []
                                        )}
                                        {((billingData.total_settle_amount -
                                          billingData.total_settle_amount_prev) /
                                          billingData.total_settle_amount_prev) *
                                          100 <
                                        0
                                          ? " " +
                                            decimal(
                                              ((billingData.total_settle_amount -
                                                billingData.total_settle_amount_prev) /
                                                billingData.total_settle_amount_prev) *
                                                100 *
                                                -1
                                            ) +
                                            "%" +
                                            " ( -" +
                                            (billingData.total_settle_amount -
                                              billingData.total_settle_amount_prev) *
                                              -1 +
                                            " )"
                                          : " " +
                                            decimal(
                                              ((billingData.total_settle_amount -
                                                billingData.total_settle_amount_prev) /
                                                billingData.total_settle_amount_prev) *
                                                100
                                            ) +
                                            "%" +
                                            " ( +" +
                                            (billingData.total_settle_amount -
                                              billingData.total_settle_amount_prev) +
                                            " )"}
                                      </font>
                                    ) : (
                                      <font style={{ color: "#52A452" }}>0%</font>
                                    )}
                              </div>
                            </div>
                        </div>
                        {auth.role === "sa" && (
                          <div
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              borderBottom: "1px solid #f3f3fa",
                              minHeight: 76,
                              maxHeight: 76,
                            }}
                          >
                            <div className="row">
                              <div className="col">
                                <b>Disbursed Amount Billing</b>
                              </div>
                              <div className="col BigNumber2 text-right">
                                {" "}
                                {typeof billingData.total_disburse_amount !==
                                  "undefined" &&
                                billingData.total_disburse_amount !== null
                                  ? formatValuetoMoney(
                                      billingData.total_disburse_amount
                                    )
                                  : 0}
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div
                                className="row"
                                style={{ alignItems: "center" }}
                              >
                                <div className="col">
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
                                  </div>
                                </div>
                                <div className="col BigNumber2 text-right">
                                    <AnimatedNumber
                                      className="font-weight-bold black"
                                      value={
                                        billingData.total_disburse_amount_prev
                                      }
                                      formatValue={formatValuetoMoney}
                                    />
                                </div>
                              </div>
                            )}
                            <div className="row">
                            <div className="col text-right">
                                  {billingData.total_disburse_amount_prev !==
                                    0 && periode === "periode" ? (
                                    <font
                                      style={{
                                        color: `${
                                          ((billingData.total_disburse_amount -
                                            billingData.total_disburse_amount_prev) /
                                            billingData.total_disburse_amount_prev) *
                                            100 <
                                          0
                                            ? "#E12029"
                                            : "#52A452"
                                        }`,
                                      }}
                                    >
                                      {((billingData.total_disburse_amount -
                                        billingData.total_disburse_amount_prev) /
                                        billingData.total_disburse_amount_prev) *
                                        100 <
                                      0 ? (
                                        <FiChevronUp
                                          style={{
                                            transform: "rotate(180deg)",
                                            marginBottom: "6px",
                                          }}
                                        />
                                      ) : ((billingData.total_disburse_amount -
                                          billingData.total_disburse_amount_prev) /
                                          billingData.total_disburse_amount_prev) *
                                          100 >
                                        0 ? (
                                        <FiChevronUp
                                          style={{ marginBottom: "6px" }}
                                        />
                                      ) : (
                                        []
                                      )}
                                      {((billingData.total_disburse_amount -
                                        billingData.total_disburse_amount_prev) /
                                        billingData.total_disburse_amount_prev) *
                                        100 <
                                      0
                                        ? " " +
                                          decimal(
                                            ((billingData.total_disburse_amount -
                                              billingData.total_disburse_amount_prev) /
                                              billingData.total_disburse_amount_prev) *
                                              100 *
                                              -1
                                          ) +
                                          "%" +
                                          " ( -" +
                                          (billingData.total_disburse_amount -
                                            billingData.total_disburse_amount_prev) *
                                            -1 +
                                          " )"
                                        : " " +
                                          decimal(
                                            ((billingData.total_disburse_amount -
                                              billingData.total_disburse_amount_prev) /
                                              billingData.total_disburse_amount_prev) *
                                              100
                                          ) +
                                          "%" +
                                          " ( +" +
                                          (billingData.total_disburse_amount -
                                            billingData.total_disburse_amount_prev) +
                                          " )"}
                                    </font>
                                  ) : (
                                    <font style={{ color: "#52A452" }}>0%</font>
                                  )}
                                </div>
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderBottom: "1px solid #f3f3fa",
                            minHeight: 76,
                            maxHeight: 76,
                          }}
                        >
                          <div className="row">
                            <div className="col">
                              <b>Unsettled Amount Billing</b>
                            </div>
                            <div className="col BigNumber2 text-right">
                              {" "}
                              {typeof billingData.total_unsettle_amount !==
                                "undefined" &&
                              billingData.total_unsettle_amount !== null
                                ? formatValuetoMoney(
                                    billingData.total_unsettle_amount
                                  )
                                : 0}
                            </div>
                          </div>
                          {periode !== "all" && (
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col">
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
                                </div>
                              </div>
                              <div className="col BigNumber2 text-right">
                                  <AnimatedNumber
                                    className="font-weight-bold black"
                                    value={
                                      billingData.total_unsettle_amount_prev
                                    }
                                    formatValue={formatValuetoMoney}
                                  />
                              </div>
                            </div>
                          )}
                          <div className="row">
                          <div className="col text-right">
                                {billingData.total_unsettle_amount_prev !== 0 &&
                                periode === "periode" ? (
                                  <font
                                    style={{
                                      color: `${
                                        ((billingData.total_unsettle_amount -
                                          billingData.total_unsettle_amount_prev) /
                                          billingData.total_unsettle_amount_prev) *
                                          100 <
                                        0
                                          ? "#E12029"
                                          : "#52A452"
                                      }`,
                                    }}
                                  >
                                    {((billingData.total_unsettle_amount -
                                      billingData.total_unsettle_amount_prev) /
                                      billingData.total_unsettle_amount_prev) *
                                      100 <
                                    0 ? (
                                      <FiChevronUp
                                        style={{
                                          transform: "rotate(180deg)",
                                          marginBottom: "6px",
                                        }}
                                      />
                                    ) : ((billingData.total_unsettle_amount -
                                        billingData.total_unsettle_amount_prev) /
                                        billingData.total_unsettle_amount_prev) *
                                        100 >
                                      0 ? (
                                      <FiChevronUp
                                        style={{ marginBottom: "6px" }}
                                      />
                                    ) : (
                                      []
                                    )}
                                    {((billingData.total_unsettle_amount -
                                      billingData.total_unsettle_amount_prev) /
                                      billingData.total_unsettle_amount_prev) *
                                      100 <
                                    0
                                      ? " " +
                                        decimal(
                                          ((billingData.total_unsettle_amount -
                                            billingData.total_unsettle_amount_prev) /
                                            billingData.total_unsettle_amount_prev) *
                                            100 *
                                            -1
                                        ) +
                                        "%" +
                                        " ( -" +
                                        (billingData.total_unsettle_amount -
                                          billingData.total_unsettle_amount_prev) *
                                          -1 +
                                        " )"
                                      : " " +
                                        decimal(
                                          ((billingData.total_unsettle_amount -
                                            billingData.total_unsettle_amount_prev) /
                                            billingData.total_unsettle_amount_prev) *
                                            100
                                        ) +
                                        "%" +
                                        " ( +" +
                                        (billingData.total_unsettle_amount -
                                          billingData.total_unsettle_amount_prev) +
                                        " )"}
                                  </font>
                                ) : (
                                  <font style={{ color: "#52A452" }}>0%</font>
                                )}
                              </div>
                          </div>
                        </div>
                        {auth.role === "sa" && (
                          <div
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              minHeight: 76,
                              maxHeight: 76,
                            }}
                          >
                            <div className="row">
                              <div className="col">
                                <b>Undisbursed Amount Billing</b>
                              </div>
                              <div className="col BigNumber2 text-right">
                                {" "}
                                {typeof billingData.total_undisburse_amount !==
                                  "undefined" &&
                                billingData.total_undisburse_amount !== null
                                  ? formatValuetoMoney(
                                      billingData.total_undisburse_amount
                                    )
                                  : 0}
                              </div>
                            </div>
                            {periode !== "all" && (
                              <div
                                className="row"
                                style={{ alignItems: "center" }}
                              >
                                <div className="col">
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
                                  </div>
                                </div>
                                <div className="col BigNumber2 text-right">
                                    <AnimatedNumber
                                      className="font-weight-bold black"
                                      value={
                                        billingData.total_undisburse_amount_prev
                                      }
                                      formatValue={formatValuetoMoney}
                                    />
                                </div>
                              </div>
                            )}
                            <div className="row">
                            <div className="col text-right">
                                  {billingData.total_undisburse_amount_prev !==
                                    0 && periode === "periode" ? (
                                    <font
                                      style={{
                                        color: `${
                                          ((billingData.total_undisburse_amount -
                                            billingData.total_undisburse_amount_prev) /
                                            billingData.total_undisburse_amount_prev) *
                                            100 <
                                          0
                                            ? "#E12029"
                                            : "#52A452"
                                        }`,
                                      }}
                                    >
                                      {((billingData.total_undisburse_amount -
                                        billingData.total_undisburse_amount_prev) /
                                        billingData.total_undisburse_amount_prev) *
                                        100 <
                                      0 ? (
                                        <FiChevronUp
                                          style={{
                                            transform: "rotate(180deg)",
                                            marginBottom: "6px",
                                          }}
                                        />
                                      ) : ((billingData.total_undisburse_amount -
                                          billingData.total_undisburse_amount_prev) /
                                          billingData.total_undisburse_amount_prev) *
                                          100 >
                                        0 ? (
                                        <FiChevronUp
                                          style={{ marginBottom: "6px" }}
                                        />
                                      ) : (
                                        []
                                      )}
                                      {((billingData.total_undisburse_amount -
                                        billingData.total_undisburse_amount_prev) /
                                        billingData.total_undisburse_amount_prev) *
                                        100 <
                                      0
                                        ? " " +
                                          decimal(
                                            ((billingData.total_undisburse_amount -
                                              billingData.total_undisburse_amount_prev) /
                                              billingData.total_undisburse_amount_prev) *
                                              100 *
                                              -1
                                          ) +
                                          "%" +
                                          " ( -" +
                                          (billingData.total_undisburse_amount -
                                            billingData.total_undisburse_amount_prev) *
                                            -1 +
                                          " )"
                                        : " " +
                                          decimal(
                                            ((billingData.total_undisburse_amount -
                                              billingData.total_undisburse_amount_prev) /
                                              billingData.total_undisburse_amount_prev) *
                                              100
                                          ) +
                                          "%" +
                                          " ( +" +
                                          (billingData.total_undisburse_amount -
                                            billingData.total_undisburse_amount_prev) +
                                          " )"}
                                    </font>
                                  ) : (
                                    <font style={{ color: "#52A452" }}>0%</font>
                                  )}
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {auth.role !== "sa" && (
              <div className="col-6">
                <div className="Container flex-column m-0">
                  <div className="mb-4">
                    <h5>Billing Summary</h5>
                  </div>
                  {billingList.length === 0 && (
                    <div className="text-center pb-3">No billing summary</div>
                  )}
                  {billingList.length > 0 && (
                    <>
                      <div className="row mb-4">
                        <div className="col-4">
                          <select
                            className="form-control"
                            onChange={(event) => {
                              if (event.target.value === null) {
                                return;
                              }
                              const el = event.target.value.split(" ");
                              setSelectedMonth(el[0]);
                              setSelectedYear(el[1]);
                            }}
                          >
                            <option value={null}>Select Month</option>
                            {billingList.length > 0 &&
                              billingList.map((el) => {
                                if (el.length === 0) {
                                  return null;
                                }
                                console.log(el);
                                return (
                                  <>
                                    <option
                                      value={`${el[0].month} ${el[0].year}`}
                                    >
                                      {`${el[0].month} ${el[0].year}`}
                                    </option>
                                  </>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          maxHeight: "544px",
                          overflow: "auto",
                        }}
                      >
                        {billingList.findIndex(
                          (x) => x[0].month === selectedMonth
                        ) > -1 &&
                          billingList[
                            billingList.findIndex(
                              (x) => x[0].month === selectedMonth
                            )
                          ].map(
                            ({ summary_name, total_amount, year, month }) => {
                              return (
                                <div className="row no-gutters">
                                  <div className="col-8">
                                    <strong>{summary_name} </strong>:{" "}
                                  </div>
                                  <div
                                    className="col-4"
                                    style={{ textAlign: "right" }}
                                    onClick={() => {
                                      history.push(
                                        "/" + auth.role + "/billing/settlement"
                                      );
                                    }}
                                  >
                                    {toMoney(total_amount)}
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* <div
          className={
            auth.role !== "sa" ? "col-6 mr-0 pr-0" : "col-12 mr-0 pr-0"
          }
          >
          <div
            className="Container cursor-pointer mr-0"
            style={{
              // marginLeft: 16,
              marginRight: 0,
            }}
            onClick={() => {
              history.push("/" + auth.role + "/billing/settlement");
            }}
          >
            <div>
              <div
                style={{
                  
                  padding: 16,
                }}
              >
                <div>Paid Amount Billing</div>
                
                <div  className="BigNumber2"> {typeof billingData.total_paid_amount !== 'undefined' && billingData.total_paid_amount !== null ? formatValuetoMoney(billingData.total_paid_amount) : 0}</div>
              </div>
              <div
                style={{
                  
                  padding: 16,
                }}
              >
                <div>Settled Amount Billing</div>
                <div  className="BigNumber2"> {typeof billingData.total_settle_amount !== 'undefined' && billingData.total_settle_amount !== null ? formatValuetoMoney(billingData.total_settle_amount) : 0}</div>
                 
              </div>
              {auth.role === "sa" && (
                <div
                  style={{
                    
                    padding: 16,
                  }}
                >
                  <div>Disbursed Amount Billing</div>
                  <div  className="BigNumber2"> {typeof billingData.total_disburse_amount !== 'undefined' && billingData.total_disburse_amount !== null  ? formatValuetoMoney(billingData.total_disburse_amount) : 0}</div>
                    
                </div>
              )}
              <div
                style={{
                  
                  padding: 16,
                }}
              >
                <div>Unpaid Amount Billing</div>
                <div  className="BigNumber2"> {typeof billingData.total_unpaid_amount !== 'undefined' && billingData.total_unpaid_amount !== null ? formatValuetoMoney(billingData.total_unpaid_amount) : 0}</div>
                   
              </div>
              <div
                style={{
                  
                  padding: 16,
                }}
              >
                <div>Unsettled Amount Billing</div>
                <div  className="BigNumber2"> {typeof billingData.total_unsettle_amount !== 'undefined' && billingData.total_unsettle_amount !== null  ? formatValuetoMoney(billingData.total_unsettle_amount) : 0}</div>
                     
              </div>
              {auth.role === "sa" && (
                <div
                  style={{
                    
                    padding: 16,
                  }}
                >
                  <div>Undisbursed Amount Billing</div>
                  <div  className="BigNumber2"> {typeof billingData.total_undisburse_amount !== 'undefined' && billingData.total_undisburse_amount !== null  ? formatValuetoMoney(billingData.total_undisburse_amount) : 0}</div>
                  
                </div>
              )}
            </div>
          </div>
        </div> */}
          </div>

          {/* Staff Statistic */}
          <div className="row no-gutters">
            <div className="Container-dashboard flex-column">
              <div className="col mt-2 mb-4">
                <h5>Staff Statistics</h5>
              </div>
              <div
                className=""
                style={{
                  marginRight: 0,
                  flexDirection: "column",
                  padding: 0,
                }}
              >
                <div className="row no-gutters">
                  {!isTechnician && (
                    <div className="col">
                      <div
                        className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                        onClick={() => {
                          history.push("/" + auth.role + "/staff", {
                            role: "technician",
                            roleLabel: "Technician",
                          });
                        }}
                      >
                        <div
                          className="row no-gutters align-items-center"
                          style={{ minWidth: 150 }}
                        >
                          <div className="col-auto">
                            <div className="w-auto">
                              <img
                                alt=""
                                src={require("./../../assets/Technician.jpg")}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <AnimatedNumber
                              className="BigNumber2 black ml-3"
                              value={
                                staffStatistic.staff_role_data
                                  ?.num_of_technician || "0"
                              }
                              formatValue={formatValue}
                            />
                            <div className="text-nowrap ml-3">Technician</div>
                          </div>
                        </div>
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center mt-2">
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
                                  value={
                                    staffStatistic.staff_role_data_prev
                                      ?.num_of_technician
                                  }
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    // <div className="col-6 col-md-4 col-lg">
                    //   <div
                    //     className="Container align-items-center border-2 cursor-pointer"
                    //     onClick={() => {
                    //       history.push("/" + auth.role + "/staff", {
                    //         role: "technician",
                    //         roleLabel: "Technician",
                    //       });
                    //     }}
                    //   >
                    //     <div
                    //       style={{
                    //         width: "auto",
                    //         marginRight: 4,
                    //       }}
                    //     >
                    //       <img alt="" src={require('./../../assets/Technician.jpg')} />
                    //     </div>
                    //     <div
                    //       style={{
                    //         flex: 1,
                    //         // padding: 16,
                    //         // borderRight: '1px solid #f3f3fa',
                    //       }}
                    //     >
                    //       <AnimatedNumber
                    //         className="BigNumber2 black"
                    //         value={staffStatistic.staff_role_data?.num_of_technician || "0"}
                    //         formatValue={formatValue}
                    //       />
                    //       <p className="black">Technician</p>
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                  {!isSecurity && (
                    <div className="col">
                      <div
                        className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                        onClick={() => {
                          history.push("/" + auth.role + "/staff", {
                            role: "security",
                            roleLabel: "Security",
                          });
                        }}
                      >
                        <div
                          className="row no-gutters align-items-center"
                          style={{ minWidth: 150 }}
                        >
                          <div className="col-auto">
                            <div className="w-auto">
                              <img
                                alt=""
                                src={require("./../../assets/Security.jpg")}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <AnimatedNumber
                              className="BigNumber2 black ml-3"
                              value={
                                staffStatistic.staff_role_data
                                  ?.num_of_security || "0"
                              }
                              formatValue={formatValue}
                            />
                            <div className="text-nowrap ml-3">Security</div>
                          </div>
                        </div>
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center mt-2">
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
                                  value={
                                    staffStatistic.staff_role_data_prev
                                      ?.num_of_security
                                  }
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    // <div className="col-6 col-md-4 col-lg">
                    //   <div
                    //     className="Container align-items-center border-2 cursor-pointer"
                    //     onClick={() => {
                    //       history.push("/" + auth.role + "/staff", {
                    //         role: "security",
                    //         roleLabel: "Security",
                    //       });
                    //     }}
                    //   >
                    //     <div
                    //       style={{
                    //         width: "auto",
                    //         marginRight: 4,
                    //       }}
                    //     >
                    //       <img alt="" src={require('./../../assets/Security.jpg')} />
                    //     </div>
                    //     <div
                    //       style={{
                    //         flex: 1,
                    //         // padding: 16,
                    //         // borderRight: '1px solid #f3f3fa',
                    //       }}
                    //     >
                    //       <AnimatedNumber
                    //         className="BigNumber2 black"
                    //         value={staffStatistic.staff_role_data?.num_of_security || "0"}
                    //         formatValue={formatValue}
                    //       />
                    //       <p className="black">Security</p>
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                  {!isCourier && (
                    <div className="col">
                      <div
                        className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                        onClick={() => {
                          history.push("/" + auth.role + "/staff", {
                            role: "courier",
                            roleLabel: "Courier",
                          });
                        }}
                      >
                        <div
                          className="row no-gutters align-items-center"
                          style={{ minWidth: 150 }}
                        >
                          <div className="col-auto">
                            <div className="w-auto">
                              <img
                                alt=""
                                src={require("./../../assets/Courier.jpg")}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <AnimatedNumber
                              className="BigNumber2 black ml-3"
                              value={
                                staffStatistic.staff_role_data
                                  ?.num_of_courier || "0"
                              }
                              formatValue={formatValue}
                            />
                            <div className="text-nowrap ml-3">Courier</div>
                          </div>
                        </div>
                        {periode !== "all" && (
                          <div className="row no-gutters align-items-center mt-2">
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
                                  value={
                                    staffStatistic.staff_role_data_prev
                                      ?.num_of_courier
                                  }
                                  formatValue={formatValue}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    // <div className="col-6 col-md-4 col-lg">
                    //   <div
                    //     className="Container align-items-center border-2 cursor-pointer"
                    //     onClick={() => {
                    //       history.push("/" + auth.role + "/staff", {
                    //         role: "courier",
                    //         roleLabel: "Courier",
                    //       });
                    //     }}
                    //   >
                    //     <div
                    //       style={{
                    //         width: "auto",
                    //         marginRight: 4,
                    //       }}
                    //     >
                    //       <img alt="" src={require('./../../assets/Courier.jpg')} />
                    //     </div>
                    //     <div
                    //       style={{
                    //         flex: 1,
                    //         // padding: 16,
                    //         // borderRight: '1px solid #f3f3fa',
                    //       }}
                    //     >
                    //       <AnimatedNumber
                    //         className="BigNumber2 black"
                    //         value={
                    //           staffStatistic.staff_role_data?.num_of_courier || "0"
                    //         }
                    //         formatValue={formatValue}
                    //       />
                    //       <p className="black">Courier</p>
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                  <div className="col">
                    <div
                      className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                      onClick={() => {
                        history.push("/" + auth.role + "/staff", {
                          role: "pic_bm",
                          roleLabel: "PIC BM",
                        });
                      }}
                    >
                      <div
                        className="row no-gutters align-items-center"
                        style={{ minWidth: 150 }}
                      >
                        <div className="col-auto">
                          <div className="w-auto">
                            <img
                              alt=""
                              src={require("./../../assets/BM Admin.jpg")}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <AnimatedNumber
                            className="BigNumber2 black ml-3"
                            value={
                              staffStatistic.staff_role_data?.num_of_pic_bm ||
                              "0"
                            }
                            formatValue={formatValue}
                          />
                          <div className="text-nowrap ml-3">BM Admin</div>
                        </div>
                      </div>
                      {periode !== "all" && (
                        <div className="row no-gutters align-items-center mt-2">
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
                                value={
                                  staffStatistic.staff_role_data_prev
                                    ?.num_of_pic_bm
                                }
                                formatValue={formatValue}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="col-6 col-md-4 col-lg">
                  <div
                    className="Container align-items-center border-2 cursor-pointer"
                    onClick={() => {
                      history.push("/" + auth.role + "/staff", {
                        role: "pic_bm",
                        roleLabel: "PIC BM",
                      });
                    }}
                  >
                    <div
                      style={{
                        width: "auto",
                        marginRight: 4,
                      }}
                    >
                      <img alt="" src={require('./../../assets/BM Admin.jpg')} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        // padding: 16,
                        // borderRight: '1px solid #f3f3fa',
                      }}
                    >
                      <AnimatedNumber
                        className="BigNumber2 black"
                        value={staffStatistic.staff_role_data?.num_of_pic_bm || "0"}
                        formatValue={formatValue}
                      />
                      <p className="text-nowrap black">BM Admin</p>
                    </div>
                  </div>
                </div> */}

                  <div className="col">
                    <div
                      className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                      onClick={() => {
                        history.push("/" + auth.role + "/staff", {
                          role: "gm_bm",
                          roleLabel: "BM Manager",
                        });
                      }}
                    >
                      <div
                        className="row no-gutters align-items-center"
                        style={{ minWidth: 150 }}
                      >
                        <div className="col-auto">
                          <div className="w-auto">
                            <img
                              alt=""
                              src={require("./../../assets/BM Manager.jpg")}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <AnimatedNumber
                            className="BigNumber2 black ml-3"
                            value={
                              staffStatistic.staff_role_data?.num_of_gm_bm ||
                              "0"
                            }
                            formatValue={formatValue}
                          />
                          <div className="text-nowrap ml-3">BM Manager</div>
                        </div>
                      </div>
                      {periode !== "all" && (
                        <div className="row no-gutters align-items-center mt-2">
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
                                value={
                                  staffStatistic.staff_role_data_prev
                                    ?.num_of_gm_bm
                                }
                                formatValue={formatValue}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="col-6 col-md-4 col-lg">
                  <div
                    className="Container align-items-center border-2 cursor-pointer"
                    onClick={() => {
                      history.push("/" + auth.role + "/staff", {
                        role: "gm_bm",
                        roleLabel: "BM Manager",
                      });
                    }}
                  >
                    <div
                      style={{
                        width: "auto",
                        marginRight: 4,
                      }}
                    >
                      <img alt="" src={require('./../../assets/BM Manager.jpg')} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        // padding: 16,
                        // borderRight: '1px solid #f3f3fa',
                      }}
                    >
                      <AnimatedNumber
                        className="BigNumber2 black"
                        value={staffStatistic.staff_role_data?.num_of_gm_bm || "0"}
                        formatValue={formatValue}
                      />
                      <p className="text-nowrap black">BM Manager</p>
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* End of Staff Statistic */}

          {/* User Statistic */}
          <div className="row no-gutters">
            <div className="Container-dashboard flex-column">
              <div className="col mt-2 mb-4">
                <h5>User Statistics</h5>
              </div>
              <div className="row no-gutters">
                <div className="Container-user-statistic flex-column">
                  <div className="row no-gutters">
                    <div
                      className="col-2 border-3"
                      style={{ borderTopLeftRadius: 10 }}
                    >
                      Basic User
                    </div>

                    <div
                      className="col-10 border-4"
                      style={{ borderTopRightRadius: 10 }}
                    >
                      <div className="row no-gutters align-items-center">
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Total Basic User</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={
                                residentStatistic.registered_resident_basic
                              }
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Total Basic User</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={
                                residentStatistic.registered_resident_basic
                              }
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                      </div>
                      {periode !== "all" && (
                        <div className="row no-gutters align-items-center ml-3 mb-3">
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
                                value={
                                  residentStatistic.registered_resident_basic_prev
                                }
                                formatValue={formatValue}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div
                              style={{ fontSize: 12 }}
                              className="text-nowrap ml-3"
                            >
                              <font style={{ color: "#52A452" }}>
                                {residentStatistic.registered_resident_basic_prev !==
                                0
                                  ? decimal(
                                      ((residentStatistic.registered_resident_basic -
                                        residentStatistic.registered_resident_basic_prev) /
                                        residentStatistic.registered_resident_basic_prev) *
                                        100
                                    )
                                  : 0}
                                %
                              </font>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-2 border-3">Premium User</div>

                    <div className="col-10 border-4">
                      <div className="row no-gutters align-items-center">
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">
                              Total Premium User
                            </div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.registered_resident}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={
                                        residentStatistic.registered_resident_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.registered_resident_prev !==
                                      0
                                        ? decimal(
                                            ((residentStatistic.registered_resident -
                                              residentStatistic.registered_resident_prev) /
                                              residentStatistic.registered_resident_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">
                              Total Premium User
                            </div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.registered_resident}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Owner</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.owners}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={residentStatistic.owners_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.owners_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.owners -
                                              residentStatistic.owners_prev) /
                                              residentStatistic.owners_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Owner</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.owners}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Family Account</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.owners_family}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={
                                        residentStatistic.owners_family_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.owners_family_prev !==
                                      0
                                        ? decimal(
                                            ((residentStatistic.owners_family -
                                              residentStatistic.owners_family_prev) /
                                              residentStatistic.owners_family_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Family Account</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.owners_family}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Rental</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tenants}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={residentStatistic.tenants_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.tenants_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.tenants -
                                              residentStatistic.tenants_prev) /
                                              residentStatistic.tenants_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Rental</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tenants}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Rental Family</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tenants_family}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={
                                        residentStatistic.tenants_family_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.tenants_family_prev !==
                                      0
                                        ? decimal(
                                            ((residentStatistic.tenants_family -
                                              residentStatistic.tenants_family_prev) /
                                              residentStatistic.tenants_family_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Rental Family</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tenants_family}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters">
                    <div
                      className="col-2 border-3"
                      style={{ borderBottomLeftRadius: 10 }}
                    >
                      <div className="row no-gutters">
                        <div className="col-12">
                          <div className="col">Active User</div>
                          <div className="col">(Engagement)</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-10 border-4"
                      style={{ borderBottomRightRadius: 10 }}
                    >
                      <div className="row no-gutters align-items-center">
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Total Engagement</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              // value={staffStatistic.num_of_login_staff}
                              value={
                                residentStatistic.payment +
                                residentStatistic.tasks +
                                residentStatistic.announcement +
                                residentStatistic.shop
                              }
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={
                                        residentStatistic.payment_prev +
                                        residentStatistic.tasks_prev +
                                        residentStatistic.announcement_prev +
                                        residentStatistic.shop_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.payment_prev +
                                        residentStatistic.tasks_prev +
                                        residentStatistic.announcement_prev +
                                        residentStatistic.shop_prev !==
                                      0
                                        ? decimal(
                                            ((residentStatistic.payment +
                                              residentStatistic.tasks +
                                              residentStatistic.announcement +
                                              residentStatistic.shop -
                                              (residentStatistic.payment_prev +
                                                residentStatistic.tasks_prev +
                                                residentStatistic.announcement_prev +
                                                residentStatistic.shop_prev)) /
                                              (residentStatistic.payment_prev +
                                                residentStatistic.tasks_prev +
                                                residentStatistic.announcement_prev +
                                                residentStatistic.shop_prev)) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Total Engagement</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              // value={staffStatistic.num_of_login_staff}
                              value={
                                residentStatistic.payment +
                                residentStatistic.tasks +
                                residentStatistic.announcement +
                                residentStatistic.shop
                              }
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Payment with Yipy</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.payment}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={residentStatistic.payment_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.payment_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.payment -
                                              residentStatistic.payment_prev) /
                                              residentStatistic.payment_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Payment with Yipy</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.payment}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Task Management</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tasks}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={residentStatistic.tasks_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.tasks_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.tasks -
                                              residentStatistic.tasks_prev) /
                                              residentStatistic.tasks_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Task Management</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.tasks}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">News/Announcement</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.announcement}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={
                                        residentStatistic.announcement_prev
                                      }
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.announcement_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.announcement -
                                              residentStatistic.announcement_prev) /
                                              residentStatistic.announcement_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">News/Announcement</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.announcement}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                        {periode !== "all" ? (
                          <div
                            className="col ml-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Shopping</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.shop}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                            {periode !== "all" && (
                              <div className="row no-gutters align-items-center mb-3">
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
                                      value={residentStatistic.shop_prev}
                                      formatValue={formatValue}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div
                                    style={{ fontSize: 12 }}
                                    className="text-nowrap ml-3"
                                  >
                                    <font style={{ color: "#52A452" }}>
                                      {residentStatistic.shop_prev !== 0
                                        ? decimal(
                                            ((residentStatistic.shop -
                                              residentStatistic.shop_prev) /
                                              residentStatistic.shop_prev) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </font>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="col ml-3 mb-3 mt-3"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-nowrap">Shopping</div>
                            <AnimatedNumber
                              className="border-4-font font-weight-bold black"
                              value={residentStatistic.shop}
                              // value={staffData.num_of_login_staff}
                              formatValue={formatValue}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {announcementLists.length === 0 && (
              <div className="text-center pb-3">No data found</div>
            )}
            <div
              style={{
                maxHeight: "544px",
                overflow: "auto",
              }}
            >
              {announcementLists.map(
                ({ title, description, image, id, created_on }, i) => {
                  return (
                    <div className="row no-gutters">
                      <div className="col-12">
                        <CardList
                          onClick={() => {
                            history.push(
                              "/" + auth.role + "/announcement/" + id
                            );
                          }}
                          className="mb-4 bread"
                          key={id}
                          title={title}
                          description={parser(description)}
                          imgSrc={image}
                          createdOn={moment(created_on).format("DD MMM YYYY")}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div> */}
            </div>
          </div>
          {/* End Of User Statistic */}
        </>
      )}

      {/* End of SA Section */}

      {/* Start of BM Section */}

      {auth.role !== "sa" && (
        <>
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
                          <h2 className="mt-3 PageTitle no-wrap">
                            Building Overview
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
              <div className="col mt-2 mb-4">
                <h5>Building Statistics</h5>
              </div>
              <div className="row no-gutters">
                <div className="col">
                  <div
                    className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer"
                    onClick={() => {
                      auth.role === "bm"
                        ? history.push(
                            "/" +
                              auth.role +
                              "/building/" +
                              auth.user.building_id,
                            { tab: 2 }
                          )
                        : history.push("/" + auth.role + "/building");
                    }}
                  >
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 220 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Total Unit 2.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-3">Total Unit</div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black ml-3"
                          value={unitStatistic.registered_unit}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={unitStatistic.registered_unit_previous}
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            style={{ fontSize: 12 }}
                            className="text-nowrap ml-3 text-right"
                          >
                            {unitStatistic.registered_unit_previous !== 0 ? (
                              <font
                                style={{
                                  color: `${
                                    ((unitStatistic.registered_unit -
                                      unitStatistic.registered_unit_previous) /
                                      unitStatistic.registered_unit_previous) *
                                      100 <
                                    0
                                      ? "#E12029"
                                      : "#52A452"
                                  }`,
                                }}
                              >
                                {((unitStatistic.registered_unit -
                                  unitStatistic.registered_unit_previous) /
                                  unitStatistic.registered_unit_previous) *
                                  100 <
                                0 ? (
                                  <FiChevronUp
                                    style={{
                                      transform: "rotate(180deg)",
                                      marginBottom: "6px",
                                    }}
                                  />
                                ) : ((unitStatistic.registered_unit -
                                    unitStatistic.registered_unit_previous) /
                                    unitStatistic.registered_unit_previous) *
                                    100 >
                                  0 ? (
                                  <FiChevronUp
                                    style={{ marginBottom: "6px" }}
                                  />
                                ) : (
                                  []
                                )}
                                {((unitStatistic.registered_unit -
                                  unitStatistic.registered_unit_previous) /
                                  unitStatistic.registered_unit_previous) *
                                  100 <
                                0
                                  ? " " +
                                    decimal(
                                      ((unitStatistic.registered_unit -
                                        unitStatistic.registered_unit_previous) /
                                        unitStatistic.registered_unit_previous) *
                                        100 *
                                        -1
                                    ) +
                                    "%" +
                                    " ( -" +
                                    (unitStatistic.registered_unit -
                                      unitStatistic.registered_unit_previous) *
                                      -1 +
                                    " )"
                                  : " " +
                                    decimal(
                                      ((unitStatistic.registered_unit -
                                        unitStatistic.registered_unit_previous) /
                                        unitStatistic.registered_unit_previous) *
                                        100
                                    ) +
                                    "%" +
                                    " ( +" +
                                    (unitStatistic.registered_unit -
                                      unitStatistic.registered_unit_previous) +
                                    " )"}
                              </font>
                            ) : (
                              0
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 220 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Online Staff 1.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-3">Online Staff</div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black ml-3"
                          value={staffStatistic.num_of_login_staff}
                          // value={staffData.num_of_login_staff}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={staffStatistic.num_of_login_staff_previous}
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            style={{ fontSize: 12 }}
                            className="text-nowrap ml-3 text-right"
                          >
                            <font style={{ color: "#52A452" }}>
                              {staffStatistic.num_of_login_staff <
                              staffStatistic.num_of_login_staff_previous
                                ? decimal(
                                    ((staffStatistic.num_of_login_staff -
                                      staffStatistic.num_of_login_staff_previous) /
                                      staffStatistic.num_of_login_staff_previous) *
                                      100
                                  )
                                : staffStatistic.num_of_login_staff >
                                    staffStatistic.num_of_login_staff_previous &&
                                  staffStatistic.num_of_login_staff_previous !==
                                    0
                                ? decimal(
                                    (unitStatistic.registered_unit_previous /
                                      staffStatistic.num_of_login_staff) *
                                      100
                                  )
                                : 0}
                              %
                            </font>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col">
                  {/* <div className="Container color-6 d-flex flex-column cursor-pointer">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <AnimatedNumber
                      className="h2 font-weight-bold white"
                      // value={residentStatistic.online_resident + residentStatistic.online_resident_basic}
                      value={staffData.num_of_login_resident}
                      formatValue={formatValue}
                    />
                    <div className="text-nowrap">Online Resident(s)</div>
                  </div>
                  <div className="col-auto">
                    <div className="w-auto">
                      <RiUserFollowLine className="BigIcon white my-0" />
                    </div>
                  </div>
                </div>
              </div> */}
                  <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 220 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Online Resident.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-3">Online Resident</div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black ml-3"
                          // value={residentStatistic.online_resident + residentStatistic.online_resident_basic}
                          value={staffData.num_of_login_resident}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={
                                residentStatistic.online_resident_prev +
                                residentStatistic.online_resident_basic_prev
                              }
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            style={{ fontSize: 12 }}
                            className="text-nowrap ml-3 text-right"
                          >
                            {residentStatistic.online_resident_prev +
                              residentStatistic.online_resident_basic_prev !==
                            0 ? (
                              <font
                                style={{
                                  color: `${
                                    ((residentStatistic.online_resident +
                                      residentStatistic.online_resident_basic -
                                      (residentStatistic.online_resident_prev +
                                        residentStatistic.online_resident_basic_prev)) /
                                      (residentStatistic.online_resident_prev +
                                        residentStatistic.online_resident_basic_prev)) *
                                      100 <
                                    0
                                      ? "#E12029"
                                      : "#52A452"
                                  }`,
                                }}
                              >
                                {((residentStatistic.online_resident +
                                  residentStatistic.online_resident_basic -
                                  (residentStatistic.online_resident_prev +
                                    residentStatistic.online_resident_basic_prev)) /
                                  (residentStatistic.online_resident_prev +
                                    residentStatistic.online_resident_basic_prev)) *
                                  100 <
                                0 ? (
                                  <FiChevronUp
                                    style={{
                                      transform: "rotate(180deg)",
                                      marginBottom: "6px",
                                    }}
                                  />
                                ) : ((residentStatistic.online_resident +
                                    residentStatistic.online_resident_basic -
                                    (residentStatistic.online_resident_prev +
                                      residentStatistic.online_resident_basic_prev)) /
                                    (residentStatistic.online_resident_prev +
                                      residentStatistic.online_resident_basic_prev)) *
                                    100 >
                                  0 ? (
                                  <FiChevronUp
                                    style={{ marginBottom: "6px" }}
                                  />
                                ) : (
                                  []
                                )}
                                {((residentStatistic.online_resident +
                                  residentStatistic.online_resident_basic -
                                  (residentStatistic.online_resident_prev +
                                    residentStatistic.online_resident_basic_prev)) /
                                  (residentStatistic.online_resident_prev +
                                    residentStatistic.online_resident_basic_prev)) *
                                  100 <
                                0
                                  ? " " +
                                    decimal(
                                      ((residentStatistic.online_resident +
                                        residentStatistic.online_resident_basic -
                                        (residentStatistic.online_resident_prev +
                                          residentStatistic.online_resident_basic_prev)) /
                                        (residentStatistic.online_resident_prev +
                                          residentStatistic.online_resident_basic_prev)) *
                                        100 *
                                        -1
                                    ) +
                                    "%" +
                                    " ( -" +
                                    (residentStatistic.online_resident +
                                      residentStatistic.online_resident_basic -
                                      (residentStatistic.online_resident_prev +
                                        residentStatistic.online_resident_basic_prev)) *
                                      -1 +
                                    " )"
                                  : " " +
                                    decimal(
                                      ((residentStatistic.online_resident +
                                        residentStatistic.online_resident_basic -
                                        (residentStatistic.online_resident_prev +
                                          residentStatistic.online_resident_basic_prev)) /
                                        (residentStatistic.online_resident_prev +
                                          residentStatistic.online_resident_basic_prev)) *
                                        100
                                    ) +
                                    "%" +
                                    " ( +" +
                                    (residentStatistic.online_resident +
                                      residentStatistic.online_resident_basic -
                                      (residentStatistic.online_resident_prev +
                                        residentStatistic.online_resident_basic_prev))}
                              </font>
                            ) : (
                              <font style={{ color: "#52A452" }}>0%</font>
                            )}
                            {/* <font style={{color:"#52A452"}}>
                            {
                            (residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev) !== 0 ?
                            decimal((((residentStatistic.online_resident + residentStatistic.online_resident_basic)-(residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev))/(residentStatistic.online_resident_prev + residentStatistic.online_resident_basic_prev))*100)
                            :
                            0
                            }%
                          </font> */}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 220 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Onboarding Resident.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-3">
                          Onboarded Resident
                        </div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black ml-3"
                          value={
                            residentStatistic.onboard_resident +
                            residentStatistic.onboard_resident_basic
                          }
                          // value={staffData.num_of_onboarded_resident}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                    {/* {periode !== "all" && (
                    <div className="row no-gutters align-items-center mt-2">
                      <div className="col-auto">
                        <div style={{ fontSize:12 }} className="text-nowrap">
                        <font style={{color:"#C4C4C4"}}>vs
                        {
                        periode === "year" ? " Tahun" 
                        :
                        periode === "month"? " Bulan"
                        :
                        periode === "day" ? " Hari"
                        :
                        " " + toSentenceCase(periode)} Lalu:
                        </font>
                        <AnimatedNumber
                          className="font-weight-bold black ml-2"
                          value={residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev}
                          formatValue={formatValue}
                        />
                        </div>
                      </div>
                      <div className="col">
                        <div style={{ fontSize:12 }} className="text-nowrap ml-3 text-right">
                            {
                            residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev !== 0 ?
                            <font 
                            style={{ 
                              color: `${(((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100 < 0 ?
                              '#E12029'
                            :
                              '#52A452'}`}}
                            >
                            {
                              (((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100 < 0 ?
                              <FiChevronUp style={{transform: 'rotate(180deg)', marginBottom: "6px"}}/>
                              :
                              (((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100 > 0 ?
                              <FiChevronUp style={{ marginBottom: "6px"}}/>
                              :
                              []
                            }
                            {
                              (((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100 < 0 ?
                              " " + (decimal((((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100*(-1))) + "%" + " ( -" + (((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*(-1)) + " )"
                              :
                              " " + decimal((((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))/(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev))*100) + "%" + " ( +" + ((residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)-(residentStatistic.onboard_resident_prev + residentStatistic.onboard_resident_basic_prev)) + " )"
                            }
                            </font>
                            :
                            <font style={{color: "#52A452"}}>
                            0%
                            </font>
                            }
                        </div>
                      </div>
                    </div>
                    )} */}
                  </div>
                </div>
                <div className="col">
                  {/* <div className="Container color-8 d-flex flex-column cursor-pointer">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <AnimatedNumber
                      className="h2 font-weight-bold white"
                      // value={unitStatistic.onboard_unit}
                      value={staffData.num_of_onboarded_unit}
                      formatValue={formatValue}
                    />
                    <div className="text-nowrap">Onboarded Unit(s)</div>
                  </div>
                  <div className="col-auto">
                    <div className="w-auto">
                      <RiBuilding4Line className="BigIcon white my-0" />
                    </div>
                  </div>
                </div>
              </div> */}
                  <div className="Container-dashboard-ns border-1 d-flex flex-column cursor-pointer">
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 220 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Onboarding Unit 2.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-3">Occupied Unit</div>
                        <AnimatedNumber
                          className="h2 font-weight-bold black ml-3"
                          value={unitStatistic.onboard_unit}
                          // value={staffData.num_of_onboarded_unit}
                          formatValue={formatValue}
                        />
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={unitStatistic.onboard_unit_previous}
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            style={{ fontSize: 12 }}
                            className="text-nowrap ml-3 text-right"
                          >
                            {unitStatistic.onboard_unit_previous !== 0 ? (
                              <font
                                style={{
                                  color: `${
                                    ((unitStatistic.onboard_unit -
                                      unitStatistic.onboard_unit_previous) /
                                      unitStatistic.onboard_unit_previous) *
                                      100 <
                                    0
                                      ? "#E12029"
                                      : "#52A452"
                                  }`,
                                }}
                              >
                                {((unitStatistic.onboard_unit -
                                  unitStatistic.onboard_unit_previous) /
                                  unitStatistic.onboard_unit_previous) *
                                  100 <
                                0 ? (
                                  <FiChevronUp
                                    style={{
                                      transform: "rotate(180deg)",
                                      marginBottom: "6px",
                                    }}
                                  />
                                ) : ((unitStatistic.onboard_unit -
                                    unitStatistic.onboard_unit_previous) /
                                    unitStatistic.onboard_unit_previous) *
                                    100 >
                                  0 ? (
                                  <FiChevronUp
                                    style={{ marginBottom: "6px" }}
                                  />
                                ) : (
                                  []
                                )}
                                {((unitStatistic.onboard_unit -
                                  unitStatistic.onboard_unit_previous) /
                                  unitStatistic.onboard_unit_previous) *
                                  100 <
                                0
                                  ? " " +
                                    decimal(
                                      ((unitStatistic.onboard_unit -
                                        unitStatistic.onboard_unit_previous) /
                                        unitStatistic.onboard_unit_previous) *
                                        100
                                    ) *
                                      -1 +
                                    "%" +
                                    " ( -" +
                                    (unitStatistic.onboard_unit -
                                      unitStatistic.onboard_unit_previous) +
                                    " )"
                                  : " " +
                                    decimal(
                                      ((unitStatistic.onboard_unit -
                                        unitStatistic.onboard_unit_previous) /
                                        unitStatistic.onboard_unit_previous) *
                                        100
                                    ) +
                                    "%" +
                                    " ( +" +
                                    (unitStatistic.onboard_unit -
                                      unitStatistic.onboard_unit_previous) +
                                    " )"}
                              </font>
                            ) : (
                              0
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-12">
              <div className="Container-dashboard flex-column pr-4">
                <BarChartDMYAdm
                  headTitle="Billing Statistics"
                  dataChart={billingGraphFormatted}
                  range={range}
                  setRange={setRange}
                  tower={tower}
                  setTower={setTower}
                  buildingName={buildingName}
                  setBuildingName={setBuildingName}
                  buildingLabel={buildingLabel}
                  setBuildingLabel={setBuildingLabel}
                  unitLabel={unitLabel}
                  setUnitLabel={setUnitLabel}
                  dataY={["Amount Billing"]}
                  dataX={["Date"]}
                  barClick={() => {
                    history.push("/" + auth.role + "/billing/unit");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="Row mb-4">
            {auth.role !== "sa" && (
              <div className="col-6">
                <div className="Container-dashboard flex-column m-0">
                  <div className="mb-4">
                    <h5>Billing Summary</h5>
                  </div>
                  {billingList.length === 0 && (
                    <div className="text-center pb-3">No billing summary</div>
                  )}
                  {billingList.length > 0 && (
                    <>
                      <div className="row mb-4">
                        <div className="col-4">
                          <select
                            className="form-control"
                            onChange={(event) => {
                              if (event.target.value === null) {
                                return;
                              }
                              const el = event.target.value.split(" ");
                              setSelectedMonth(el[0]);
                              setSelectedYear(el[1]);
                            }}
                          >
                            <option value={null}>Select Month</option>
                            {billingList.length > 0 &&
                              billingList.map((el) => {
                                if (el.length === 0) {
                                  return null;
                                }
                                console.log(el);
                                return (
                                  <>
                                    <option
                                      value={`${el[0].month} ${el[0].year}`}
                                    >
                                      {`${el[0].month} ${el[0].year}`}
                                    </option>
                                  </>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          maxHeight: "544px",
                          overflow: "auto",
                        }}
                      >
                        {billingList.findIndex(
                          (x) => x[0].month === selectedMonth
                        ) > -1 &&
                          billingList[
                            billingList.findIndex(
                              (x) => x[0].month === selectedMonth
                            )
                          ].map(
                            ({ summary_name, total_amount, year, month }) => {
                              return (
                                <div
                                  className="row no-gutters"
                                  style={{ paddingBottom: "8px" }}
                                >
                                  <div className="col-8">
                                    <strong>{summary_name} </strong>:{" "}
                                  </div>
                                  <div
                                    className="col-4"
                                    style={{ textAlign: "right" }}
                                    onClick={() => {
                                      history.push(
                                        "/" + auth.role + "/billing/settlement"
                                      );
                                    }}
                                  >
                                    {toMoney(total_amount)}
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            <div
              className={
                auth.role !== "sa" ? "col-6 mr-0 pr-0" : "col-12 mr-0 pr-0"
              }
            >
              <div
                className="Container-dashboard cursor-pointer mr-0"
                style={{
                  // marginLeft: 16,
                  marginRight: 0,
                }}
                onClick={() => {
                  history.push("/" + auth.role + "/billing/settlement");
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid #f3f3fa",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <div>Paid Amount Billing</div>

                    <div className="BigNumber">
                      {" "}
                      {typeof billingData.total_paid_amount !== "undefined" &&
                      billingData.total_paid_amount !== null
                        ? formatValuetoMoney(billingData.total_paid_amount)
                        : 0}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <div>Settled Amount Billing</div>
                    <div className="BigNumber">
                      {" "}
                      {typeof billingData.total_settle_amount !== "undefined" &&
                      billingData.total_settle_amount !== null
                        ? formatValuetoMoney(billingData.total_settle_amount)
                        : 0}
                    </div>
                  </div>
                  {auth.role === "sa" && (
                    <div
                      style={{
                        flex: 1,
                        padding: 16,
                      }}
                    >
                      <div>Disbursed Amount Billing</div>
                      <div className="BigNumber">
                        {" "}
                        {typeof billingData.total_disburse_amount !==
                          "undefined" &&
                        billingData.total_disburse_amount !== null
                          ? formatValuetoMoney(
                              billingData.total_disburse_amount
                            )
                          : 0}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <div>Unpaid Amount Billing</div>
                    <div className="BigNumber">
                      {" "}
                      {typeof billingData.total_unpaid_amount !== "undefined" &&
                      billingData.total_unpaid_amount !== null
                        ? formatValuetoMoney(billingData.total_unpaid_amount)
                        : 0}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <div>Unsettled Amount Billing</div>
                    <div className="BigNumber">
                      {" "}
                      {typeof billingData.total_unsettle_amount !==
                        "undefined" &&
                      billingData.total_unsettle_amount !== null
                        ? formatValuetoMoney(billingData.total_unsettle_amount)
                        : 0}
                    </div>
                  </div>
                  {auth.role === "sa" && (
                    <div
                      style={{
                        flex: 1,
                        padding: 16,
                      }}
                    >
                      <div>Undisbursed Amount Billing</div>
                      <div className="BigNumber">
                        {" "}
                        {typeof billingData.total_undisburse_amount !==
                          "undefined" &&
                        billingData.total_undisburse_amount !== null
                          ? formatValuetoMoney(
                              billingData.total_undisburse_amount
                            )
                          : 0}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              marginRight: 0,
              flexDirection: "column",
              padding: 0,
            }}
          >
            <div className="row no-gutters">
              <div className="col-6 col-md-4 col-lg">
                {/* <div
              className="Container align-items-center color-1 cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/resident");
              }}
              >
              <div
                style={{
                  width: "auto",
                }}
              >
                <FiUsers className="h1 mr-4 my-0" />
              </div>
              <div
              >
                <AnimatedNumber
                  className="BigNumber white"
                  value={residentStatistic.registered_resident || "0"}
                  formatValue={formatValue}
                />
                <p className="white">Resident</p>
              </div>
            </div> */}
                <div
                  className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                  onClick={() => {
                    history.push("/" + auth.role + "/resident");
                  }}
                >
                  <div
                    className="row no-gutters align-items-center"
                    style={{ minWidth: 220 }}
                  >
                    <div className="col-auto">
                      <div className="w-auto">
                        <img
                          alt=""
                          src={require("./../../assets/Resident.jpg")}
                        />
                      </div>
                    </div>
                    <div className="col">
                      {/* <div className="text-nowrap ml-3">Registered Resident</div>
                  <AnimatedNumber
                    className="h2 font-weight-bold black ml-3"
                    value={residentStatistic.registered_resident}
                    // value={staffData.num_of_onboarded_resident}
                    formatValue={formatValue}
                  /> */}
                      <AnimatedNumber
                        className="BigNumber2 black ml-3"
                        value={residentStatistic.registered_resident}
                        formatValue={formatValue}
                      />
                      <div className="text-nowrap ml-3">
                        Registered Resident
                      </div>
                    </div>
                  </div>
                  {periode !== "all" && (
                    <div className="row no-gutters align-items-center mt-2">
                      <div className="col-auto">
                        <div style={{ fontSize: 12 }} className="text-nowrap">
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
                            value={residentStatistic.registered_resident_prev}
                            formatValue={formatValue}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div
                          style={{ fontSize: 12 }}
                          className="text-nowrap ml-3 text-right"
                        >
                          {residentStatistic.registered_resident_prev !== 0 ? (
                            <font
                              style={{
                                color: `${
                                  ((residentStatistic.registered_resident -
                                    residentStatistic.registered_resident_prev) /
                                    residentStatistic.registered_resident_prev) *
                                    100 <
                                  0
                                    ? "#E12029"
                                    : "#52A452"
                                }`,
                              }}
                            >
                              {((residentStatistic.registered_resident -
                                residentStatistic.registered_resident_prev) /
                                residentStatistic.registered_resident_prev) *
                                100 <
                              0 ? (
                                <FiChevronUp
                                  style={{
                                    transform: "rotate(180deg)",
                                    marginBottom: "6px",
                                  }}
                                />
                              ) : ((residentStatistic.registered_resident -
                                  residentStatistic.registered_resident_prev) /
                                  residentStatistic.registered_resident_prev) *
                                  100 >
                                0 ? (
                                <FiChevronUp style={{ marginBottom: "6px" }} />
                              ) : (
                                []
                              )}
                              {((residentStatistic.registered_resident -
                                residentStatistic.registered_resident_prev) /
                                residentStatistic.registered_resident_prev) *
                                100 <
                              0
                                ? " " +
                                  decimal(
                                    ((residentStatistic.registered_resident -
                                      residentStatistic.registered_resident_prev) /
                                      residentStatistic.registered_resident_prev) *
                                      100 *
                                      -1
                                  ) +
                                  "%" +
                                  " ( -" +
                                  (unitStatistic.registered_unit -
                                    unitStatistic.registered_unit_previous) +
                                  " )"
                                : " " +
                                  decimal(
                                    ((residentStatistic.registered_resident -
                                      residentStatistic.registered_resident_prev) /
                                      residentStatistic.registered_resident_prev) *
                                      100
                                  ) +
                                  "%" +
                                  " ( +" +
                                  (unitStatistic.registered_unit -
                                    unitStatistic.registered_unit_previous) +
                                  " )"}
                            </font>
                          ) : (
                            <font style={{ color: "#52A452" }}>0%</font>
                          )}
                          {/* <font style={{color:"#52A452"}}>
                          {
                          (residentStatistic.registered_resident_prev) !== 0 ?
                          decimal((residentStatistic.registered_resident-residentStatistic.registered_resident_prev/residentStatistic.registered_resident_prev)*100)
                          :
                          0
                          }%
                        </font> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {!isTechnician && (
                <div className="col">
                  <div
                    className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                    onClick={() => {
                      history.push("/" + auth.role + "/staff", {
                        role: "technician",
                        roleLabel: "Technician",
                      });
                    }}
                  >
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 150 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Technician.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <AnimatedNumber
                          className="BigNumber2 black ml-3"
                          value={
                            staffStatistic.staff_role_data?.num_of_technician ||
                            "0"
                          }
                          formatValue={formatValue}
                        />
                        <div className="text-nowrap ml-3">Technician</div>
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={
                                staffStatistic.staff_role_data_prev
                                  ?.num_of_technician
                              }
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                // <div className="col-6 col-md-4 col-lg">
                //   <div
                //     className="Container align-items-center border-2 cursor-pointer"
                //     onClick={() => {
                //       history.push("/" + auth.role + "/staff", {
                //         role: "technician",
                //         roleLabel: "Technician",
                //       });
                //     }}
                //   >
                //     <div
                //       style={{
                //         width: "auto",
                //         marginRight: 4,
                //       }}
                //     >
                //       <img alt="" src={require('./../../assets/Technician.jpg')} />
                //     </div>
                //     <div
                //       style={{
                //         flex: 1,
                //         // padding: 16,
                //         // borderRight: '1px solid #f3f3fa',
                //       }}
                //     >
                //       <AnimatedNumber
                //         className="BigNumber2 black"
                //         value={staffStatistic.staff_role_data?.num_of_technician || "0"}
                //         formatValue={formatValue}
                //       />
                //       <p className="black">Technician</p>
                //     </div>
                //   </div>
                // </div>
              )}
              {!isSecurity && (
                <div className="col">
                  <div
                    className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                    onClick={() => {
                      history.push("/" + auth.role + "/staff", {
                        role: "security",
                        roleLabel: "Security",
                      });
                    }}
                  >
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 150 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Security.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <AnimatedNumber
                          className="BigNumber2 black ml-3"
                          value={
                            staffStatistic.staff_role_data?.num_of_security ||
                            "0"
                          }
                          formatValue={formatValue}
                        />
                        <div className="text-nowrap ml-3">Security</div>
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={
                                staffStatistic.staff_role_data_prev
                                  ?.num_of_security
                              }
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                // <div className="col-6 col-md-4 col-lg">
                //   <div
                //     className="Container align-items-center border-2 cursor-pointer"
                //     onClick={() => {
                //       history.push("/" + auth.role + "/staff", {
                //         role: "security",
                //         roleLabel: "Security",
                //       });
                //     }}
                //   >
                //     <div
                //       style={{
                //         width: "auto",
                //         marginRight: 4,
                //       }}
                //     >
                //       <img alt="" src={require('./../../assets/Security.jpg')} />
                //     </div>
                //     <div
                //       style={{
                //         flex: 1,
                //         // padding: 16,
                //         // borderRight: '1px solid #f3f3fa',
                //       }}
                //     >
                //       <AnimatedNumber
                //         className="BigNumber2 black"
                //         value={staffStatistic.staff_role_data?.num_of_security || "0"}
                //         formatValue={formatValue}
                //       />
                //       <p className="black">Security</p>
                //     </div>
                //   </div>
                // </div>
              )}
              {!isCourier && (
                <div className="col">
                  <div
                    className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                    onClick={() => {
                      history.push("/" + auth.role + "/staff", {
                        role: "courier",
                        roleLabel: "Courier",
                      });
                    }}
                  >
                    <div
                      className="row no-gutters align-items-center"
                      style={{ minWidth: 150 }}
                    >
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            alt=""
                            src={require("./../../assets/Courier.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <AnimatedNumber
                          className="BigNumber2 black ml-3"
                          value={
                            staffStatistic.staff_role_data?.num_of_courier ||
                            "0"
                          }
                          formatValue={formatValue}
                        />
                        <div className="text-nowrap ml-3">Courier</div>
                      </div>
                    </div>
                    {periode !== "all" && (
                      <div className="row no-gutters align-items-center mt-2">
                        <div className="col-auto">
                          <div style={{ fontSize: 12 }} className="text-nowrap">
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
                              value={
                                staffStatistic.staff_role_data_prev
                                  ?.num_of_courier
                              }
                              formatValue={formatValue}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                // <div className="col-6 col-md-4 col-lg">
                //   <div
                //     className="Container align-items-center border-2 cursor-pointer"
                //     onClick={() => {
                //       history.push("/" + auth.role + "/staff", {
                //         role: "courier",
                //         roleLabel: "Courier",
                //       });
                //     }}
                //   >
                //     <div
                //       style={{
                //         width: "auto",
                //         marginRight: 4,
                //       }}
                //     >
                //       <img alt="" src={require('./../../assets/Courier.jpg')} />
                //     </div>
                //     <div
                //       style={{
                //         flex: 1,
                //         // padding: 16,
                //         // borderRight: '1px solid #f3f3fa',
                //       }}
                //     >
                //       <AnimatedNumber
                //         className="BigNumber2 black"
                //         value={
                //           staffStatistic.staff_role_data?.num_of_courier || "0"
                //         }
                //         formatValue={formatValue}
                //       />
                //       <p className="black">Courier</p>
                //     </div>
                //   </div>
                // </div>
              )}
              <div className="col">
                <div
                  className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                  onClick={() => {
                    history.push("/" + auth.role + "/staff", {
                      role: "pic_bm",
                      roleLabel: "PIC BM",
                    });
                  }}
                >
                  <div
                    className="row no-gutters align-items-center"
                    style={{ minWidth: 150 }}
                  >
                    <div className="col-auto">
                      <div className="w-auto">
                        <img
                          alt=""
                          src={require("./../../assets/BM Admin.jpg")}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <AnimatedNumber
                        className="BigNumber2 black ml-3"
                        value={
                          staffStatistic.staff_role_data?.num_of_pic_bm || "0"
                        }
                        formatValue={formatValue}
                      />
                      <div className="text-nowrap ml-3">BM Admin</div>
                    </div>
                  </div>
                  {periode !== "all" && (
                    <div className="row no-gutters align-items-center mt-2">
                      <div className="col-auto">
                        <div style={{ fontSize: 12 }} className="text-nowrap">
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
                            value={
                              staffStatistic.staff_role_data_prev?.num_of_pic_bm
                            }
                            formatValue={formatValue}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-6 col-md-4 col-lg">
            <div
              className="Container align-items-center border-2 cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/staff", {
                  role: "pic_bm",
                  roleLabel: "PIC BM",
                });
              }}
            >
              <div
                style={{
                  width: "auto",
                  marginRight: 4,
                }}
              >
                <img alt="" src={require('./../../assets/BM Admin.jpg')} />
              </div>
              <div
                style={{
                  flex: 1,
                  // padding: 16,
                  // borderRight: '1px solid #f3f3fa',
                }}
              >
                <AnimatedNumber
                  className="BigNumber2 black"
                  value={staffStatistic.staff_role_data?.num_of_pic_bm || "0"}
                  formatValue={formatValue}
                />
                <p className="text-nowrap black">BM Admin</p>
              </div>
            </div>
          </div> */}

              <div className="col">
                <div
                  className="Container-dashboard-ns border-2 d-flex flex-column cursor-pointer"
                  onClick={() => {
                    history.push("/" + auth.role + "/staff", {
                      role: "gm_bm",
                      roleLabel: "BM Manager",
                    });
                  }}
                >
                  <div
                    className="row no-gutters align-items-center"
                    style={{ minWidth: 150 }}
                  >
                    <div className="col-auto">
                      <div className="w-auto">
                        <img
                          alt=""
                          src={require("./../../assets/BM Manager.jpg")}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <AnimatedNumber
                        className="BigNumber2 black ml-3"
                        value={
                          staffStatistic.staff_role_data?.num_of_gm_bm || "0"
                        }
                        formatValue={formatValue}
                      />
                      <div className="text-nowrap ml-3">BM Manager</div>
                    </div>
                  </div>
                  {periode !== "all" && (
                    <div className="row no-gutters align-items-center mt-2">
                      <div className="col-auto">
                        <div style={{ fontSize: 12 }} className="text-nowrap">
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
                            value={
                              staffStatistic.staff_role_data_prev?.num_of_gm_bm
                            }
                            formatValue={formatValue}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-6 col-md-4 col-lg">
            <div
              className="Container align-items-center border-2 cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/staff", {
                  role: "gm_bm",
                  roleLabel: "BM Manager",
                });
              }}
            >
              <div
                style={{
                  width: "auto",
                  marginRight: 4,
                }}
              >
                <img alt="" src={require('./../../assets/BM Manager.jpg')} />
              </div>
              <div
                style={{
                  flex: 1,
                  // padding: 16,
                  // borderRight: '1px solid #f3f3fa',
                }}
              >
                <AnimatedNumber
                  className="BigNumber2 black"
                  value={staffStatistic.staff_role_data?.num_of_gm_bm || "0"}
                  formatValue={formatValue}
                />
                <p className="text-nowrap black">BM Manager</p>
              </div>
            </div>
          </div> */}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="Container-dashboard flex-column">
                <div className="mb-4">
                  <h5>List of Announcements</h5>
                </div>
                {announcementLists.length === 0 && (
                  <div className="text-center pb-3">No announcements</div>
                )}
                <div
                  style={{
                    maxHeight: "544px",
                    overflow: "auto",
                  }}
                >
                  {announcementLists.map(
                    ({ title, description, image, id, created_on }, i) => {
                      return (
                        <div className="row no-gutters">
                          <div className="col-12">
                            <CardList
                              onClick={() => {
                                history.push(
                                  "/" + auth.role + "/announcement/" + id
                                );
                              }}
                              className="mb-4 bread"
                              key={id}
                              title={title}
                              description={parser(description)}
                              imgSrc={image}
                              createdOn={moment(created_on).format(
                                "DD MMM YYYY"
                              )}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* End of BM Section */}
    </Loading>
  );
}

export default Component;
