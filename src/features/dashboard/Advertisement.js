import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { endpointGlobal } from "../../settings";
import LineCharts from "./Components/LineCharts";
import "./style_new.css";
import { get } from "../slice";
import { useDispatch } from "react-redux";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Button from "../../components/Button";

import Loading from "../../components/Loading";



const myVariable = {
  data: {
    data_report: [],
    data_key: []
  }
};

function Component() {
  const [timeline, setTimeline] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("Time");
  const [type, setType] = useState("pop-up");

  const [loading, setLoading] = useState(false);
  const [dataStatistic, setDataStatistic]= useState(myVariable.data);
  const [dataKeys, setDataKeys] = useState([]);

  let dispatch = useDispatch();

  
  useEffect(() => {
    console.log("JOSSSSSSSSSSSSSS");
    setLoading(true);
    dispatch(
      get(endpointGlobal + "/transaction/statistic?category_id=1", (res) => {
        setLoading(false);
        console.log("DATA: ", res.data)
        setDataStatistic(res.data.data);
      })
    );
  },[dispatch]);

  console.log("TIMELINE: ", dataStatistic.data_report)


  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  return (
    <Loading loading={loading}>
      <div className="row no-gutters">
        <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
          <h2 className="mt-3 PageTitle no-wrap">Statistic Overview</h2>
        </div>
      </div>
      
      <div className="row no-gutters">
        <div className="col-12">
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ borderRadius: 10 }}
          >
            {/* <div
              className="col"
              style={{ paddingBottom: "16px", paddingTop: "5px" }}
            >
              <h5>All Campaign</h5>
            </div> */}
            <div className="row mb-4 p-3">
              <LineCharts
                data={dataStatistic.data_report}
                dataKeys={dataStatistic.data_key}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default Component;