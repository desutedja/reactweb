import React, { useEffect, useCallback, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FiX, FiSearch, FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../../components/Button";
import TableInternet from "../../../../components/TableInternet";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Filter from "../../../../components/Filter";
import { toSentenceCase, removeLastFromPath, dateFormatter, toMoney } from "../../../../utils";
import SectionSeparator from "../../../../components/SectionSeparator";
import Resident from "../../../../components/cells/Resident";

import {
  getResidentUnit,
  addResidentUnit,
  deleteSubaccount,
  deleteUnit,
  refresh,
} from "../../../slices/resident";
import { get, post, setConfirmDelete } from "../../../slice";
import Loading from "../../../../components/Loading";
import { RiCalendarEventLine } from "react-icons/ri";
import { dateTimeFormatter } from "../../../../utils";
import { endpointAdmin, endpointInternet, endpointResident } from "../../../../settings";
import { deleteInternetPackage, setSelected } from "../../../slices/internet";
import InternetPackage from "../../../../components/cells/InternetPackage";

const columnsUnit = [
  { Header: "Package Name", accessor: (row) => 
  <InternetPackage
    id={row.id}
    data={row}
    items={[
      <b>{row.package_name}</b>,
      // <p>
      //   Discount :{" "}
      //   {row.discount_type === "percentage"
      //     ? `${row.discount}%`
      //     : toMoney(row.discount)}
      // </p>,
      // <p>{toSentenceCase(row.type)}</p>
    ]}
  />      
  },
  { Header: "Speed", accessor: (row) => 
    <b>{row.speed}</b>,
  },
  { Header: "Price", accessor: (row) => 
    toMoney(row.price),
  },
  { Header: "Coverage Area", accessor: (row) =>
    row.coverage_area
  },
  { Header: "Created On", accessor: (row) =>
    dateTimeFormatter(row.created_on)
  },
];

function Component({ id, view, canAdd, canUpdate, canDelete }) {

  const [data, setData] = useState({ items: [] });
  const {
    internet, refreshToggle, loading
  } = useSelector(state => state['internet']);
  const { role } = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let history = useHistory();
  let { path, url } = useRouteMatch();

  return (
    <>
      <TableInternet
        noContainer={true}
        columns={columnsUnit}
        data={data?.data || []}
        loading={loading}
        pageCount={internet.total_pages}
        fetchData={useCallback(
          (page, limit, searchItem, sortField, sortType) => {
            // setLoading(true);
            dispatch(
              get(
                endpointInternet +
                "/admin/package?provider_id=" + 
                id,

                (res) => {
                  console.log(res.data);
                  setData(res.data);
                  // setLoading(false);
                }
              )
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
          },
          // [dispatch, buildingid, bank, startdate, enddate]
          [dispatch, refreshToggle]
        )}
        filters={[]}
        actions={
          view
            ? null
            : [
                <Button
                  key="Add Package"
                  label="Add Package"
                  icon={<FiPlus />}
                  onClick={() => {
                    dispatch(setSelected({}));
                    history.push(url + "/add");
                  }}
                />,
              //   <Button icon={<FiPlus />} label="Add Package" key="Add Package" onClick={() => history.push({
              //     pathname: addPath,
              //     // state: data,
              // })} />
              ]
        }
        onClickEdit={
          view
            ? null
            : (row) => {
              
              dispatch(setSelected(row));
              history.push(url + "/package/edit");
              // console.log(row)
            }
              
        }
        onClickDelete={
          view
            ? null
            : role === "bm" && !canDelete
            ? null
            : (row) => {
                dispatch(
                  setConfirmDelete(
                    "Are you sure to delete this package?",
                    () => {
                      console.log(row);
                      dispatch(deleteInternetPackage(row, history));
                    }
                  )
                );
              }
        }
      />
    </>
  );
}

export default Component;
