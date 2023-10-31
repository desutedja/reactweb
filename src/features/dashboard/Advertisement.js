import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { endpointGlobal } from "../../settings";
import LineCharts from "./Components/LineCharts";
import BarCharts from "./Components/BarCharts";
import Input from "../../components/Input";
import "./style_new.css";
import { get } from "../slice";
import { useDispatch } from "react-redux";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

import Loading from "../../components/Loading";



const myVariable = {
  data: {
    data_report: [],
    data_key: [],
    data_average: []
  }
};

function Component() {
  const [timeline, setTimeline] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("Time");
  const [type, setType] = useState("pop-up");

  const [loading, setLoading] = useState(false);
  const [dataStatistic, setDataStatistic]= useState(myVariable.data);
  const [dataKeys, setDataKeys] = useState([]);

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

  const [month, setMonth] = useState(monthnow + 1);

  let dispatch = useDispatch();

  
  useEffect(() => {
    console.log("JOSSSSSSSSSSSSSS");
    setLoading(true);
    dispatch(
      get(endpointGlobal + "/transaction/statistic?category_id=1&year="+year+"&month="+month, (res) => {
        setLoading(false);
        setDataStatistic(res.data.data);
      })
    );
  },[dispatch, month, year]);

  console.log("Data: ", dataStatistic.data_average)


  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  var regisVsRegisDP = ["regis", "regis_dp"];
  var activePlayer = ["active_player"];
  var trDpVstrWd = ["trans_dp","trans_wd"];
  var cvDpVscvTr = ["conv_dp","conv_tr"];
  var totalDpVstotalWd = ["total_dp","total_wd"];

  return (
    <Loading loading={loading}>
      <div className="row no-gutters">
        <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
          <h2 className="mt-3 PageTitle no-wrap">Statistic Overview</h2>
        </div>
      </div>

      <div className="row no-gutters">
      <div className="col-12">
        <div className="col-2">
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
          </div>
        </div>
      </div>
      
      <div className="row no-gutters">
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={regisVsRegisDP}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <BarCharts
                data={dataStatistic.data_average}
                dataKeys={regisVsRegisDP}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={activePlayer}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <BarCharts
                data={dataStatistic.data_average}
                dataKeys={activePlayer}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={trDpVstrWd}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <BarCharts
                data={dataStatistic.data_average}
                dataKeys={trDpVstrWd}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={cvDpVscvTr}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <BarCharts
                data={dataStatistic.data_average}
                dataKeys={cvDpVscvTr}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={totalDpVstotalWd}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            <div className="row mb-4 p-3">
              <BarCharts
                data={dataStatistic.data_average}
                dataKeys={totalDpVstotalWd}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default Component;