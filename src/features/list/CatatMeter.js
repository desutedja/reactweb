import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCatatmeter, downloadCatatMeter } from "../slices/catatmeter";
import Template from "./components/Template";
import Button from "../../components/Button";
import { FiDownload, FiSearch } from "react-icons/fi";
import Filter from "../../components/Filter";
import { get } from "../slice";
import { endpointAdmin } from "../../settings";
import { dateTimeFormatterstriped, isRangeToday } from "../../utils";
import DateRangeFilter from "../../components/DateRangeFilter";
import moment from "moment";
import Input from "../../components/Input";


const columns = [
  {
    Header: "Building Name",
    accessor: "building_name",
    sorting: "bld.name",
  },
  // {
  //   Header: "Unit ID",
  //   accessor: "unit_id",
  //   sorting: "unit_id"
  // },
  {
    Header: "Unit",
    accessor: "unit",
    sorting: "c.number",
  },
  // {
  //   Header: "Records ID",
  //   accessor: "records_id",
  //   sorting: "b.id"
  // },
  {
    Header: "Year",
    accessor: "year",
    sorting: "b.year",
  },
  {
    Header: "Month",
    accessor: "month",
    sorting: "b.month",
  },
  {
    Header: "Recent Usage",
    accessor: "recent_usage",
    sorting: "b.recent_usage",
  },
  {
    Header: "Current Usage",
    accessor: "current_usage",
    sorting: "b.current_usage",
  },
  // {
  //     Header: "Staff ID",
  //     accessor: "staff_id",
  //     sorting: "b.staff_id"
  // },
  {
    Header: "Staff Name",
    accessor: "staff_name",
    sorting: "d.firstname",
  },
  // {
  //     Header: "Published",
  //     accessor: "published",
  //     sorting: "b.published"
  // },
  {
    Header: "Meter Type",
    accessor: "metername",
    sorting: "g.name",
  },
  {
    Header: "Power",
    // accessor: "power",
    accessor: (row) => (row.power === "" ? "-" : row.power),
    sorting: "g.power",
  },
  {
    Header: "Image",
    accessor: (row) => (
      <a target="_blank" rel="noopener noreferrer" href={row.image}>
        Image
      </a>
    ),
    sorting: "b.image",
  },
  // {
  //   Header: "Created On",
  //   accessor: "created_on",
  //   sorting: "b.created_on",
  //   Cell: (props) => {
  //     //props.value will contain your date
  //     //you can convert your date here
  //     let dates = new Date(props.value);
  //     const custom_date =
  //       dates.getFullYear() +
  //       "-" +
  //       String(parseInt(dates.getMonth() + 1)).padStart(2, "0") +
  //       "-" +
  //       dates.getDate() +
  //       " " +
  //       dates.getHours() +
  //       ":" +
  //       dates.getMinutes() +
  //       ":" +
  //       dates.getSeconds();
  //     return <span>{custom_date}</span>;
  //   },
  // },
  {
    Header: "Created On",
    accessor: (row) =>
      row.created_on !== "0000-00-00 00:00:00"
        ? dateTimeFormatterstriped(row.created_on)
        : "-",
  },
];

function Component({ view, canAdd }) {
  let dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { role, user } = useSelector((state) => state.auth);

  const [file, setFile] = useState();
  const [data, setData] = useState();

  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  const today = moment().format("yyyy-MM-DD", "day");
  const monthStart = moment().startOf("month").format("yyyy-MM-DD");
  const monthEnd = moment().endOf("month").format("yyyy-MM-DD");
  const [startDate, setStartDate] = useState(monthStart);
  const [endDate, setEndDate] = useState(monthEnd);

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

  const monthnow = new Date().getMonth();
  const [month, setMonth] = useState(monthnow+1);
  const [monthName, setMonthName] = useState(months[monthnow].label);

  const yearnow = new Date().getFullYear();
  const years = [];
  for (let i = yearnow - 2; i <= yearnow + 1; i++) {
    years.push({ value: i, label: i });
  }

  const [year, setYear] = useState(yearnow);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
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

          let formatted = data.map((el) => ({ label: el.name, value: el.id }));

          if (data.length < totalItems && search.length === 0) {
            formatted.push({
              label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
              restTotal: restTotal > 5 ? 5 : restTotal,
              className: "load-more",
            });
          }

          setBuildings(formatted);
        }
      )
    );
  }, [dispatch, search, limit]);

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
        pagetitle="Catat Meter"
        columns={columns}
        slice={"catatmeter"}
        getAction={getCatatmeter}
        filterVars={[building, month, year]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: (
                    <p>
                      Building: {building ? <b>{buildingName}</b> : <b>All</b>}
                    </p>
                  ),
                  delete: () => setBuilding(""),
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Building"
                        autoComplete="off"
                        compact
                        icon={<FiSearch />}
                        inputValue={search}
                        setInputValue={setSearch}
                      />
                      <Filter
                        data={buildings}
                        onClick={(el) => {
                          if (!el.value) {
                            setLimit(limit + el.restTotal);
                            return;
                          }
                          setBuilding(el.value);
                          setBuildingName(el.label);
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                        onClickAll={() => {
                          setBuilding("");
                          setBuildingName("");
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                      />
                    </>
                  ),
                },
                {
                  hidex: month == monthnow+1,
                  label: <p>Month: {month ? monthName : months[month].label}</p>,
                  delete: () => {
                    setMonth(monthnow+1);
                    setMonthName(months[monthnow].label);
                  },
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={months}
                        onClick={(el) => {
                          if (!el.value) {
                            return;
                          }
                          setMonth(el.value);
                          setMonthName(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setMonth(monthnow+1);
                          setMonthName(months[monthnow+1].label);
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
                {
                  hidex: year == year,
                  label: <p>Year: {year}</p>,
                  delete: () => setYear(yearnow),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={years}
                        onClick={(el) => {
                          setYear(el.value);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setYear(yearnow);
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
              ]
            : [
              {
                hidex: month == monthnow+1,
                label: <p>Month: {month ? monthName : months[month].label}</p>,
                delete: () => {
                  setMonth(monthnow+1);
                  setMonthName(months[monthnow].label);
                },
                component: (toggleModal) => (
                  <>
                    <Filter
                      data={months}
                      onClick={(el) => {
                        if (!el.value) {
                          return;
                        }
                        setMonth(el.value);
                        setMonthName(el.label);
                        toggleModal(false);
                      }}
                      onClickAll={() => {
                        setMonth(monthnow+1);
                        setMonthName(months[monthnow+1].label);
                        toggleModal(false);
                      }}
                    />
                  </>
                ),
              },
              {
                hidex: year == year,
                label: <p>Year: {year}</p>,
                delete: () => setYear(yearnow),
                component: (toggleModal) => (
                  <>
                    <Filter
                      data={years}
                      onClick={(el) => {
                        setYear(el.value);
                        toggleModal(false);
                      }}
                      onClickAll={() => {
                        setYear(yearnow);
                        toggleModal(false);
                      }}
                    />
                  </>
                ),
              },
            ]
        }
        // onClickEdit={
        //   view
        //     ? null
        //     : (row) => {

        //       dispatch(setSelected(row));
        //       history.push(url + "/edit");
        //       console.log(row);
        //     }

        // }
        actionDownloads={
          view ? null : (
            <Button
              fontWeight={500}
              color="Download"
              label="Download Catat Meter.csv"
              icon={<FiDownload />}
              onClick={() => {
                dispatch(
                  downloadCatatMeter(
                    document.getElementById("Search").value,
                    building,
                    year,
                    month,
                  )
                );
              }}
            />
          )
        }
      />
    </>
  );
}

export default Component;
