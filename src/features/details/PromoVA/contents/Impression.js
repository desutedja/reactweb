import React from "react";
import parse from "html-react-parser";
import Table from "../../../../components/Table";
import { useSelector } from "react-redux";
import { dateTimeFormatter } from "../../../../utils";

function Component({ data }) {
  const selected = useSelector((state) => state.announcement.selected);

  const columns = [
    // { Header: "ID", accessor: "id" },
    {
      Header: "Resident Name",
      accessor: (row) => (
        // <a href={"/" + role + "/announcement/" + row.id}>
        <span>{row.resident_name}</span>
        // </a>
      ),
    },
    {
      Header: "Unit Floor",
      accessor: (row) => <span>{row.unit_floor}</span>,
    },
    {
      Header: "Unit Number",
      accessor: (row) => <span>{row.unit_number}</span>,
    },
    {
      Header: "Building Name",
      accessor: (row) => <span>{row.building_name}</span>,
    },
    {
      Header: "Open Count",
      accessor: (row) => (
        <span style={{ alignContent: "center" }}>{row.open_count}</span>
      ),
    },
    {
      Header: "First Open",
      accessor: (row) => (
        <span style={{ alignContent: "center" }}>
          {dateTimeFormatter(row.created_on, "-")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        noSearch
        pagination={false}
        columns={columns}
        data={data.impression}
      ></Table>
    </div>
  );
}

export default Component;
