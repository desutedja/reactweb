import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import parser from "html-react-parser";

import { FiUsers, FiBriefcase } from "react-icons/fi";
import { FaTools, FaBoxOpen } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import {
  RiBuilding2Line,
  RiBuilding4Line,
  RiHotelLine,
  RiUserStarLine,
  RiUserFollowLine,
  RiUserLocationLine,
} from "react-icons/ri";

import { toMoney, getDatesRange } from "../../utils";
import { endpointAdmin, endpointBilling, endpointManagement, endpointResident } from "../../settings";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../slice";
import { setNotificationData } from "../slices/notification";

import CardList from "../../components/CardList";
import BarChartDMY from "../../components/BarChartDMY";
import {
  Button,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import BillingItem from "../../components/cells/BillingItem";
import Loading from "../../components/Loading";

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

  const [isTechnician, setIsTechnician] = useState(false);
  const [isCourier, setIsCourier] = useState(false);
  const [isSecurity, setIsSecurity] = useState(false);
  const [billingList, setBillingList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Time");
  const [selectedYear, setSelectedYear] = useState("");
  // const [toggle, setToggle] = useState(false)
  const toggle = () => setDropdownOpen(!dropdownOpen);

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
      if (bListVal.filter((x) => x === bSummary.summary_name).length == 0) {
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
        endpointBilling + "/management/billing/graph?range=" + range + "&tower=" + tower,
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

  useEffect(() => {
    setLoading(true)
    dispatch(
      get(
        endpointBilling + "/management/billing/statistic?building_id=" + buildingName + '&tower=' + tower,
        (res) => {
        setLoading(false);
        setBillingData(res.data.data);
      })
    );
  }, [dispatch, tower, buildingName]);

  useEffect(() => {
    dispatch(
      get(endpointManagement + "/admin/staff/statistics?tower=" + tower + '&building_id=' + buildingName, (res) => {
        setStaffData(res.data.data);
        if (res.data.data.billing_summary.length > 0) {
          handleBillingSummary(res.data.data.billing_summary);
        }
      })
    );
  }, [dispatch, tower, buildingName]);

  // Unit Statistic
  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/building/unit/data?building_id=" + buildingName + "&building_section="  + tower +  "&date=2021-01-01&filter=all", (res) => {
        setUnitStatistic(res.data.data);
      })
    );
  }, [dispatch, tower, buildingName]);

  // Staff Statistic
  useEffect(() => {
    dispatch(
      get(endpointManagement + "/admin/staff/data?building_id=" + buildingName + "&building_section="  + tower +  "&date=2021-01-01&filter=all", (res) => {
        setStaffStatistic(res.data.data);
      })
    );
  }, [dispatch, tower, buildingName]);

  // Resident Statistic
  useEffect(() => {
    dispatch(
      get(endpointResident + "/management/resident/data?building_id=" + buildingName + "&building_section="  + tower +  "&date=2021-01-01&filter=all", (res) => {
        setResidentStatistic(res.data.data);
      })
    );
  }, [dispatch, tower, buildingName]);

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

  return (
    <Loading loading={loading}>
      <div className="row no-gutters">
        {/* {auth.role === "sa" && (
          <div className="col">
            <div
              className="Container border-1 d-flex flex-column cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/building");
              }}
            >
              <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <div className="w-auto">
                    <img src={require('./../../assets/Group 2311.jpg')} />
                  </div>
                </div>
                <div className="col">
                  <div className="text-nowrap ml-3">Total Building</div>
                  <AnimatedNumber
                    className="h2 font-weight-bold black ml-3"
                    value={staffData.num_of_building}
                    formatValue={formatValue}
                  />
                </div>
              </div>
            </div>
          </div>
        )} */}
        {auth.role === "sa" && (
          <div className="col">
            <div
              className="Container color-2 d-flex flex-column cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/building");
              }}
            >
              <div className="row no-gutters align-items-center">
                <div className="col">
                  <AnimatedNumber
                    className="h2 font-weight-bold white"
                    value={staffData.num_of_building}
                    formatValue={formatValue}
                  />
                  <div className="text-nowrap">Total Building</div>
                </div>
                <div className="col-auto">
                  <div className="w-auto">
                    <RiBuilding2Line className="BigIcon white my-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="col">
          <div
            className="Container color-4 d-flex flex-column cursor-pointer"
            onClick={() => {
              auth.role === "bm"
                ? history.push(
                    "/" + auth.role + "/building/" + auth.user.building_id,
                    { tab: 2 }
                  )
                : history.push("/" + auth.role + "/building");
            }}
          >
            <div className="row no-gutters align-items-center">
              <div className="col">
                <AnimatedNumber
                  className="h2 font-weight-bold white"
                  // value={unitStatistic.registered_unit}
                  value={staffData.num_of_unit}
                  formatValue={formatValue}
                />
                <div className="text-nowrap">Total Unit</div>
              </div>
              <div className="col-auto">
                <div className="w-auto">
                  <RiBuilding4Line className="BigIcon white my-0" />
                </div>
              </div>
            </div>
              {/* <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <div className="w-auto">
                    <RiBuilding4Line className="BigIcon red my-0" />
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
              </div> */}
          </div>
        </div>
        {auth.role === "sa" && (
          <>
            <div className="col">
              <div
                className="Container color-5 d-flex flex-column cursor-pointer"
                onClick={() => {
                  history.push("/" + auth.role + "/building");
                }}
              >
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <AnimatedNumber
                      className="h2 font-weight-bold white"
                      // value={
                      //   unitStatistic.registered_unit / staffData.num_of_building + ""
                      // }
                      value={
                        staffData.num_of_unit / staffData.num_of_building + ""
                      }
                      formatValue={formatValue}
                    />
                    <div className="text-nowrap">Average Unit</div>
                  </div>
                  <div className="col-auto">
                    <div className="w-auto">
                      <RiHotelLine className="BigIcon white my-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="Container color-7 d-flex flex-column cursor-pointer">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <AnimatedNumber
                      className="h2 font-weight-bold white"
                      // value={staffStatistic.num_of_login_staff}
                      value={staffData.num_of_login_staff}
                      formatValue={formatValue}
                    />
                    <div className="text-nowrap">Online Staff(s)</div>
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
        {auth.role !== "sa" && (
          <>
            <div className="col">
              <div className="Container color-7 d-flex flex-column cursor-pointer">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <AnimatedNumber
                      className="h2 font-weight-bold white"
                      // value={staffStatistic.num_of_login_staff}
                      value={staffData.num_of_login_staff}
                      formatValue={formatValue}
                    />
                    <div className="text-nowrap">Online Staff(s)</div>
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
            </div>
          </div>
          <div className="col">
            <div className="Container color-6 d-flex flex-column cursor-pointer">
              <div className="row no-gutters align-items-center">
                <div className="col">
                  <AnimatedNumber
                    className="h2 font-weight-bold white"
                    value={staffData.num_of_login_unit}
                    formatValue={formatValue}
                  />
                  <div className="text-nowrap">Online Unit(s)</div>
                </div>
                <div className="col-auto">
                  <div className="w-auto">
                    <RiBuilding4Line className="BigIcon white my-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container color-8 d-flex flex-column cursor-pointer">
              <div className="row no-gutters align-items-center">
                <div className="col">
                  <AnimatedNumber
                    className="h2 font-weight-bold white"
                    // value={(residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)}
                    value={staffData.num_of_onboarded_resident}
                    formatValue={formatValue}
                  />
                  <div className="text-nowrap">Onboarded Resident(s)</div>
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
            </div>
          </div>
        </div>
      )}
      {auth.role === "sa" && (
        <div class="row no-gutters">
          <div className="col">
            <div className="Container color-6 d-flex flex-column cursor-pointer">
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
            </div>
          </div>
          <div className="col">
            <div className="Container color-6 d-flex flex-column cursor-pointer">
              <div className="row no-gutters align-items-center">
                <div className="col">
                  <AnimatedNumber
                    className="h2 font-weight-bold white"
                    value={staffData.num_of_login_unit}
                    formatValue={formatValue}
                  />
                  <div className="text-nowrap">Online Unit(s)</div>
                </div>
                <div className="col-auto">
                  <div className="w-auto">
                    <RiBuilding4Line className="BigIcon white my-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="Container color-8 d-flex flex-column cursor-pointer">
              <div className="row no-gutters align-items-center">
                <div className="col">
                  <AnimatedNumber
                    className="h2 font-weight-bold white"
                    // value={(residentStatistic.onboard_resident + residentStatistic.onboard_resident_basic)}
                    value={staffData.num_of_onboarded_resident}
                    formatValue={formatValue}
                  />
                  <div className="text-nowrap">Onboarded Resident(s)</div>
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
            </div>
          </div>
        </div>
      )}
      <div className="row no-gutters">
        <div className="col-12">
          <div className="Container flex-column pr-4">
            <BarChartDMY
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
      <div className="Row">
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
                                <option value={`${el[0].month} ${el[0].year}`}>
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
                      ].map(({ summary_name, total_amount, year, month }) => {
                        return (
                          <div className="row no-gutters">
                            <div className="col-8">
                              <strong>{summary_name} </strong>:{" "}
                            </div>
                            <div
                              className="col-4"

                              style={{ textAlign: "right" }}
                              onClick={() => {
                                history.push("/" + auth.role + "/billing/settlement");
                              }}
                            >
                              {toMoney(total_amount)}
                            </div>
                          </div>
                        );
                      })}
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
            className="Container cursor-pointer mr-0"
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
                
                <div  className="BigNumber"> {typeof billingData.total_paid_amount !== 'undefined' && billingData.total_paid_amount != null ? formatValuetoMoney(billingData.total_paid_amount) : 0}</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 16,
                }}
              >
                <div>Settled Amount Billing</div>
                <div  className="BigNumber"> {typeof billingData.total_settle_amount !== 'undefined' && billingData.total_settle_amount != null ? formatValuetoMoney(billingData.total_settle_amount) : 0}</div>
                 
              </div>
              {auth.role === "sa" && (
                <div
                  style={{
                    flex: 1,
                    padding: 16,
                  }}
                >
                  <div>Disbursed Amount Billing</div>
                  <div  className="BigNumber"> {typeof billingData.total_disburse_amount !== 'undefined' && billingData.total_disburse_amount != null  ? formatValuetoMoney(billingData.total_disburse_amount) : 0}</div>
                    
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
                <div  className="BigNumber"> {typeof billingData.total_unpaid_amount !== 'undefined' && billingData.total_unpaid_amount != null ? formatValuetoMoney(billingData.total_unpaid_amount) : 0}</div>
                   
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 16,
                }}
              >
                <div>Unsettled Amount Billing</div>
                <div  className="BigNumber"> {typeof billingData.total_unsettle_amount !== 'undefined' && billingData.total_unsettle_amount != null  ? formatValuetoMoney(billingData.total_unsettle_amount) : 0}</div>
                     
              </div>
              {auth.role === "sa" && (
                <div
                  style={{
                    flex: 1,
                    padding: 16,
                  }}
                >
                  <div>Undisbursed Amount Billing</div>
                  <div  className="BigNumber"> {typeof billingData.total_undisburse_amount !== 'undefined' && billingData.total_undisburse_amount != null  ? formatValuetoMoney(billingData.total_undisburse_amount) : 0}</div>
                  
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
            <div
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
                style={
                  {
                    // padding: 16,
                    // borderRight: '1px solid #f3f3fa',
                  }
                }
              >
                {/* <FiUsers className="h3 mr-2" /> */}
                <AnimatedNumber
                  className="BigNumber white"
                  value={residentStatistic.registered_resident || "0"}
                  formatValue={formatValue}
                />
                <p className="white">Resident</p>
              </div>
            </div>
          </div>
          {!isTechnician && (
            <div className="col-6 col-md-4 col-lg">
              <div
                className="Container align-items-center color-1 cursor-pointer"
                onClick={() => {
                  history.push("/" + auth.role + "/staff", {
                    role: "technician",
                    roleLabel: "Technician",
                  });
                }}
              >
                <div
                  style={{
                    width: "auto",
                  }}
                >
                  <FaTools className="h2 mr-4 my-0" />
                </div>
                <div
                  style={{
                    flex: 1,
                    // padding: 16,
                    // borderRight: '1px solid #f3f3fa',
                  }}
                >
                  <AnimatedNumber
                    className="BigNumber white"
                    value={staffStatistic.staff_role_data?.num_of_technician || "0"}
                    formatValue={formatValue}
                  />
                  <p className="white">Technician</p>
                </div>
              </div>
            </div>
          )}
          {!isSecurity && (
            <div className="col-6 col-md-4 col-lg">
              <div
                className="Container align-items-center color-1 cursor-pointer"
                onClick={() => {
                  history.push("/" + auth.role + "/staff", {
                    role: "security",
                    roleLabel: "Security",
                  });
                }}
              >
                <div
                  style={{
                    width: "auto",
                  }}
                >
                  <MdSecurity className="h1 mr-4 my-0" />
                </div>
                <div
                  style={{
                    flex: 1,
                    // padding: 16,
                    // borderRight: '1px solid #f3f3fa',
                  }}
                >
                  <AnimatedNumber
                    className="BigNumber white"
                    value={staffStatistic.staff_role_data?.num_of_security || "0"}
                    formatValue={formatValue}
                  />
                  <p className="white">Security</p>
                </div>
              </div>
            </div>
          )}
          {!isCourier && (
            <div className="col-6 col-md-4 col-lg">
              <div
                className="Container align-items-center color-1 cursor-pointer"
                onClick={() => {
                  history.push("/" + auth.role + "/staff", {
                    role: "courier",
                    roleLabel: "Courier",
                  });
                }}
              >
                <div
                  style={{
                    width: "auto",
                  }}
                >
                  <FaBoxOpen className="h1 mr-4 my-0" />
                </div>
                <div
                  style={{
                    flex: 1,
                    // padding: 16,
                    // borderRight: '1px solid #f3f3fa',
                  }}
                >
                  <AnimatedNumber
                    className="BigNumber white"
                    value={
                      staffStatistic.staff_role_data?.num_of_courier || "0"
                    }
                    formatValue={formatValue}
                  />
                  <p className="white">Courier</p>
                </div>
              </div>
            </div>
          )}
          <div className="col-6 col-md-4 col-lg">
            <div
              className="Container align-items-center color-1 cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/staff", {
                  role: "pic_bm",
                  roleLabel: "PIC BM",
                });
              }}
            >
              <div className="w-auto">
                <RiBuilding2Line className="h1 mr-4 my-0" />
              </div>
              <div
                style={{
                  flex: 1,
                  // padding: 16,
                  // borderRight: '1px solid #f3f3fa',
                }}
              >
                <AnimatedNumber
                  className="BigNumber white"
                  value={staffStatistic.staff_role_data?.num_of_pic_bm || "0"}
                  formatValue={formatValue}
                />
                <p className="text-nowrap white">BM Admin</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg">
            <div
              className="Container align-items-center color-1 cursor-pointer"
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
                }}
              >
                <FiBriefcase className="h1 mr-4 my-0" />
              </div>
              <div
                style={{
                  flex: 1,
                  // padding: 16,
                  // borderRight: '1px solid #f3f3fa',
                }}
              >
                <AnimatedNumber
                  className="BigNumber white"
                  value={staffStatistic.staff_role_data?.num_of_gm_bm || "0"}
                  formatValue={formatValue}
                />
                <p className="text-nowrap white">BM Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="Container flex-column">
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
                          createdOn={moment(created_on).format("DD MMM YYYY")}
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
    </Loading>
  );
}

export default Component;
