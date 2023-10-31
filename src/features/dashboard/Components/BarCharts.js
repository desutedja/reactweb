import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLOR = ["#E12029","#254091","#F58113","#88B5E4","#52A452","#5464B6","#FFCE2A","#9F6633","#471172","#204657","#D09CB1","#D33B7E"];

const Component = ({ data, dataKeys }) => {
  let dtKey = ["regis", "regis_dp"];
  if (dataKeys.length > 0) {
    dtKey = dataKeys;
  }
  
  console.log("DATA BAR CHART: ", data);
  console.log("KEY CHART: ", dtKey)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dtKey.map((item, index) => (
          <Bar key={item} dataKey={item} fill={COLOR[index]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Component;
