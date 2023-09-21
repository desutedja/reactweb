import React, { useEffect, useCallback, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toSentenceCase,  dateFormatter } from "../../../../utils";

import Button from "../../../../components/Button";
import Table from "../../../../components/Table";
import { endpointAdmin } from "../../../../settings";
import { post, get } from "../../../slice";

const columnsUnit = [
  { Header: "ID", accessor: "id" },
  { Header: "Resident", accessor: "resident_name" },
  { Header: "Facility", accessor: "facility_name" },
  { Header: "Card Number", accessor: "card_number" },
  { Header: "Time", accessor: (row) => row.created_on ? dateFormatter(row.created_on) : "-" },
];

function Component({ id, view, canAdd, canUpdate, canDelete }) {
  const data = {
    "data": [
      {
        "id": 1,
        "resident_name":"User Satu",
        "facility_name": "Gym",
        "card_number": "1231263190",
        "created_on": "2023-08-01"
      },
      {
        "id": 2,
        "resident_name":"User Dua",
        "facility_name": "Club House",
        "card_number": "7673724616",
        "created_on": "2023-09-01"
      }
    ],
    "total_items": 2,
    "filtered_page": 1,
    "total_pages": 1,
    "filtered_item": 10
  };

  let dispatch = useDispatch();

  const [data2, setData] = useState(data);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/access/log", (res) => {
        setData(res.data);
        console.log("DATA:", data2)
      })
    );
  }, [dispatch]);

  return (
    <>
      <Table
        titleList={"Log Activity"}
        totalItems={"10"}
        noContainer={true}
        columns={columnsUnit}
        data={data2.data}
        loading={false}
        pageCount={"10"}
        // fetchData={fetchData}
        filters={[]}
      />
    </>
  );
}

export default Component;
