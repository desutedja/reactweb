import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCatatmeter } from "../slices/catatmeter";
import Template from "./components/Template";

const columns = [
    {
      Header: "Resident ID", 
      accessor: "resident_id", 
      sorting: "f.id"
    },
    {
      Header: "Resident Name", 
      accessor: "resident_name", 
      sorting: "f.firstname"
    },
    {
      Header: "Unit ID", 
      accessor: "unit_id", 
      sorting: "unit_id"
    },
    {
      Header: "Unit", 
      accessor: "unit", 
      sorting: "c.number"
    },
    {
      Header: "Records ID", 
      accessor: "records_id", 
      sorting: "b.id"
    },
    {
        Header: "Year", 
        accessor: "year", 
        sorting: "b.year"
    },
    {
        Header: "Month", 
        accessor: "month", 
        sorting: "b.month"
    },
    {
        Header: "Recent Usage", 
        accessor: "recent_usage", 
        sorting: "b.recent_usage"
    },
    {
        Header: "Current Usage", 
        accessor: "current_usage", 
        sorting: "b.current_usage"
    },
    {
        Header: "Staff ID", 
        accessor: "staff_id", 
        sorting: "b.staff_id"
    },
    {
        Header: "Staff Name", 
        accessor: "staff_name", 
        sorting: "d.firstname"
    },
    // {
    //     Header: "Published", 
    //     accessor: "published", 
    //     sorting: "b.published"
    // },
    {
        Header: "Meter Type", 
        accessor: "metername", 
        sorting: "g.name"
    },
    {
        Header: "Image", 
        accessor: (row) => (
            <a target="_blank" rel="noopener noreferrer" href={row.image}>
              Image
            </a>
          ),
        sorting: "b.image"
    },
    {
        Header: "Created On", 
        accessor: "created_on", 
        sorting: "b.created_on",
        Cell : (props) =>{
            //props.value will contain your date
            //you can convert your date here
            let dates = new Date(props.value)
            const custom_date = dates.getFullYear()+"-"+String(parseInt(dates.getMonth()+1)).padStart(2, '0')+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds();
            return <span>{custom_date}</span>
        }
    },
  ];

function Component({ view, canAdd }) {
  const { role, user } = useSelector((state) => state.auth);

  const [file, setFile] = useState();
  const [data, setData] = useState();


  useEffect(() => {
    // console.log(file);

    let form = new FormData();
    form.append("catatmeter", file);

    setData(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  return (
    <>
      <Template
        view={view}
        columns={columns}
        slice={"catatmeter"}
        getAction={getCatatmeter}
        actions={
          view
            ? null
            : (role === "bm" ? !canAdd : false)
            ? null
            : []
        }
        
      />
    </>
  );
}

export default Component;
