import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toSentenceCase, toThousand, monthsArr } from "../../../utils";

const Component = ({ data, dataKeys }) => {
  let dtKey = ["view", "click"];
  if (dataKeys.length > 0) {
    dtKey = dataKeys;
  }
  const COLOR = ["#E12029","#254091","#F58113","#88B5E4","#52A452","#5464B6","#FFCE2A","#9F6633","#471172","#204657","#D09CB1","#D33B7E"];
  console.log("DATA LINE CHART: ", data);
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart data={data}>
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {dtKey.map((item, index) => {
          return <Line dataKey={item} stroke={COLOR[index % COLOR.length]} />;
          // <Line type="monotone" dataKey="view" stroke="#e12029" />
          // <Line type="monotone" dataKey="click" stroke="#2e1029" />
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  let day = "",
    fullMonth = "";
  if (payload != null && payload.length > 0) {
    day = payload[0].payload.day;
    fullMonth = payload[0].payload.month ? monthsArr[payload[0].payload.month] : "";
  }
  if (active) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          boxShadow: "5px 5px 4px #f4f4f4",
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10,
          minWidth: 300,
          borderRadius: 10,
        }}
      >
        <p className="label">
          <strong>{`${day} ${fullMonth}`}</strong>
        </p>
        {/* <p className="intro">{getIntroOfPage(label)}</p> */}
        {payload !== null &&
          payload.length > 0 &&
          payload.map((item) => {
            return (
              <div
                className="desc"
                style={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div className="col-6">
                  {toSentenceCase(item.dataKey.toLowerCase())}
                </div>
                <div className="col-6">
                  : <strong>{toThousand(item.value)}</strong>
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default Component;
