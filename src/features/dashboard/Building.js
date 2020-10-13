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
} from "react-icons/ri";

import { toMoney, getDatesRange } from "../../utils";
import { endpointBilling, endpointManagement } from "../../settings";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../slice";
import { setNotificationData } from "../slices/notification";

import CardList from "../../components/CardList";
import BarChartDMY from "../../components/BarChartDMY";

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
  const [billingData, setBillingData] = useState({});
  const [staffData, setStaffData] = useState({});
  const [billingGraph, setBillingGraph] = useState([]);
  const [billingGraphFormatted, setBillingGraphFormatted] = useState([]);

  const [isTechnician, setIsTechnician] = useState(false);
  const [isCourier, setIsCourier] = useState(false);
  const [isSecurity, setIsSecurity] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(
      get(
        endpointBilling + "/management/billing/graph?range=" + range,
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
  }, [dispatch, range]);

  useEffect(() => {
    dispatch(
      get(endpointBilling + "/management/billing/statistic", (res) => {
        setBillingData(res.data.data);
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointManagement + "/admin/staff/statistics", (res) => {
        setStaffData(res.data.data);
      })
    );
  }, [dispatch]);

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
  }, [dispatch]);

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
    <>
      <div className="row no-gutters">
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
          </div>
        </div>
        {auth.role === "sa" && (
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
        )}
        <div className="col">
          <div className="Container color-6 d-flex flex-column cursor-pointer">
            <div className="row no-gutters align-items-center">
              <div className="col">
                <AnimatedNumber
                  className="h2 font-weight-bold white"
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
          <div className="Container color-7 d-flex flex-column cursor-pointer">
            <div className="row no-gutters align-items-center">
              <div className="col">
                <AnimatedNumber
                  className="h2 font-weight-bold white"
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
      </div>
      <div className="row no-gutters">
        <div className="col-12">
          <div className="Container flex-column pr-4">
            <BarChartDMY
              headTitle="Billing Statistics"
              dataChart={billingGraphFormatted}
              loading={loading}
              range={range}
              setRange={setRange}
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
        <div
          className="Container cursor-pointer"
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
              <AnimatedNumber
                className="BigNumber"
                value={billingData.total_paid_amount}
                formatValue={formatValuetoMoney}
              />
            </div>
            <div
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <div>Settled Amount Billing</div>
              <AnimatedNumber
                className="BigNumber"
                value={billingData.total_settle_amount}
                formatValue={formatValuetoMoney}
              />
            </div>
            {auth.role === "sa" && (
              <div
                style={{
                  flex: 1,
                  padding: 16,
                }}
              >
                <div>Disbursed Amount Billing</div>
                <AnimatedNumber
                  className="BigNumber"
                  value={billingData.total_disburse_amount}
                  formatValue={formatValuetoMoney}
                />
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
              <AnimatedNumber
                className="BigNumber"
                value={billingData.total_unpaid_amount}
                formatValue={formatValuetoMoney}
              />
            </div>
            <div
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <div>Unsettled Amount Billing</div>
              <AnimatedNumber
                className="BigNumber"
                value={billingData.total_unsettle_amount}
                formatValue={formatValuetoMoney}
              />
            </div>
            {auth.role === "sa" && (
              <div
                style={{
                  flex: 1,
                  padding: 16,
                }}
              >
                <div>Undisbursed Amount Billing</div>
                <AnimatedNumber
                  className="BigNumber"
                  value={billingData.total_undisburse_amount}
                  formatValue={formatValuetoMoney}
                />
              </div>
            )}
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
                  value={staffData.num_of_resident || "0"}
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
                    value={staffData.num_of_technician || "0"}
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
                    value={staffData.num_of_security || "0"}
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
                      staffData.num_of_unit / staffData.num_of_courier || "0"
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
                  value={
                    staffData.num_of_unit / staffData.num_of_building || "0"
                  }
                  formatValue={formatValue}
                />
                <p className="text-nowrap white">Building Manager</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg">
            <div
              className="Container align-items-center color-1 cursor-pointer"
              onClick={() => {
                history.push("/" + auth.role + "/staff", {
                  role: "gm_bm",
                  roleLabel: "GM BM",
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
                  value={
                    staffData.num_of_unit / staffData.num_of_building || "0"
                  }
                  formatValue={formatValue}
                />
                <p className="text-nowrap white">General Manager</p>
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
    </>
  );
}

export default Component;
