import React, { useEffect, useCallback, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FiX, FiSearch, FiPlus, FiEdit } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../components/Button";
import TableInternet from "../../../components/TableInternet";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Filter from "../../../components/Filter";
import { toSentenceCase, removeLastFromPath, dateFormatter } from "../../../utils";
import SectionSeparator from "../../../components/SectionSeparator";
import Resident from "../../../components/cells/Resident";

import {
  getResidentUnit,
  addResidentUnit,
  deleteSubaccount,
  deleteUnit,
  refresh,
} from "../../slices/resident";
import { endpointAdmin, endpointResident } from "../../../settings";
import { get, post, setConfirmDelete } from "../../slice";
import Loading from "../../../components/Loading";
import { RiCalendarEventLine } from "react-icons/ri";
import { dateTimeFormatter } from "../../../utils";
import Breadcrumb from "../../../components/Breadcrumb";
import { setSelected } from "../../slices/promova";
import InternetPackage from "../../../components/cells/InternetPackage";

const columnsUnit = [
  { Header: "Package Name", accessor: (row) => 
  <InternetPackage
    id={row.id}
    data={row}
    items={[
      <b>Globenet EZY</b>,
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
    <b>10 Mbps</b>,
  },
  { Header: "Price", accessor: (row) => 
    "Rp. 250.000",
  },
  { Header: "Coverage Area", accessor: (row) =>
    "Jakarta Barat, Jakarta Selatan, Kota Bandung, Balikpapan"
  },
  { Header: "Created On", accessor: "created_on" },
];

function Component({ id, view, canAdd, canUpdate, canDelete, editPath = 'edit', addPath = 'package/add' }) {
  const [addUnit, setAddUnit] = useState(false);
  const [delUnit, setDelUnit] = useState({
    delete: [],
  });
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteUnit, setConfirmDeleteUnit] = useState(false);
  const [addUnitStep, setAddUnitStep] = useState(1);

  const [data, setData] = useState({ items: [] });

  const [addSubAccount, setAddSubAccount] = useState(false);
  const [addSubAccountStep, setAddSubAccountStep] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [residents, setResidents] = useState([]);
  const [subAccount, setSubAccount] = useState({});
  const [ownershipStatus, setOwnershipStatus] = useState("");

  const [mainOwner, setMainOwner] = useState();

  const [search, setSearch] = useState("");

  const [selectedBuilding, setSelectedBuilding] = useState({});
  const [buildings, setBuildings] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState([]);

  const [
    level,
    // setLevel
  ] = useState("main");
  const [status, setStatus] = useState("own");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const { unit, loading, refreshToggle } = useSelector(
    (state) => state.resident
  );
  const { selected } = useSelector((state) => state.building);
  const { role } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState("");
  const [found, setFound] = useState(true);

  let dispatch = useDispatch();
  let history = useHistory();
  let { path, url } = useRouteMatch();

  const fetchData = useCallback(
    (pageIndex, pageSize, search) => {
      dispatch(getResidentUnit(pageIndex, pageSize, search, id));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dispatch, refreshToggle, id]
  );

  useEffect(() => {
    if (role === "bm") {
      setSelectedBuilding({ label: selected.name, value: selected });
      setAddUnitStep(2);
    }
  }, [role, selected]);

  useEffect(() => {
    setMainOwner();
    addUnitStep === 3 &&
      selectedUnit !== "" &&
      dispatch(
        get(
          endpointResident +
            "/management/resident/get_main_owner/" +
            selectedUnit.value.id,
          (res) => {
            if (res.data.data.resident && res.data.data.resident.id !== 0) {
              setMainOwner(res.data.data.resident);
            }
          }
        )
      );
  }, [addUnitStep, selectedUnit, dispatch]);

  useEffect(() => {
    addSubAccount &&
      addSubAccountStep === 1 &&
      search.length >= 1 &&
      dispatch(
        get(
          endpointResident +
            "/management/resident/read" +
            "?page=1" +
            "&limit=5" +
            "&search=" +
            search,

          (res) => {
            setResidents(res.data.data.items);
          }
        )
      );
  }, [addSubAccount, addSubAccountStep, dispatch, search]);

  useEffect(() => {
    addUnit &&
      addUnitStep === 1 &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?page=1" +
            "&limit=10" +
            "&search=" +
            search,

          (res) => {
            setBuildings(res.data.data.items);
          }
        )
      );
  }, [addUnit, addUnitStep, dispatch, search]);

  useEffect(() => {
    addUnit &&
      addUnitStep === 2 &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building/unit" +
            "?page=1" +
            "&building_id=" +
            selectedBuilding.value.id +
            "&search=" +
            search +
            "&limit=10",

          (res) => {
            setUnits(res.data.data.items);
          }
        )
      );
  }, [addUnit, search, addUnitStep, selectedBuilding, dispatch]);

  const addUnitBackFunction = useCallback(
    () => setAddUnitStep(addUnitStep - 1),
    [addUnitStep]
  );
  const addSubBackFunction = useCallback(
    () => setAddSubAccountStep(addSubAccountStep - 1),
    [addSubAccountStep]
  );

  const submitFunction = (e) => {
    dispatch(
      addResidentUnit({
        unit_id: selectedUnit.value.id,
        owner_id: parseInt(id),
        level: level,
        status: status,
        period_from: periodFrom,
        period_to: periodTo, 
      })
    );
    setAddUnit(false);
    setAddUnitStep(1);
  };

  const submitSubAccount = (e) => {
    dispatch(
      addResidentUnit({
        unit_id: selectedUnit.unit_id,
        owner_id: subAccount.id,
        level: "sub",
        parent_id: parseInt(id),
        status: ownershipStatus.value,
        period_from: periodFrom,
        period_to: periodTo
      })
    );
    setAddSubAccount(false);
    setAddSubAccountStep(1);
  };

  const deleteSub = (e) => {
    dispatch(
      deleteSubaccount(selectedUnit.unit_id, parseInt(id), subAccount.id)
    );
    setConfirmDelete(false);
  };

  function SubAccountList(item) {
    let subs = item.unit_sub_account;
    return (
      <>
        <div>
          <div style={{ marginBottom: "1vw" }}>
            <b>{subs.length} sub accounts in this unit: </b>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {subs.map((el) => (
              <div
                style={{ display: "flex", marginLeft: "50px" }}
                onClick={() => dispatch(refresh())}
              >
                <Resident id={el.id} data={el} />
                {canDelete ? (
                  <FiX
                    size={15}
                    style={{ marginTop: "10px", cursor: "pointer" }}
                    onClick={() => {
                      setConfirmDelete(true);
                      setSelectedUnit(item);
                      setSubAccount(el);
                    }}
                  />
                ) : null}
              </div>
            ))}

            <div style={{ padding: "10px", marginLeft: "50px" }}>
              {canAdd && canUpdate ? (
                <span
                  className="Link"
                  onClick={() => {
                    setAddSubAccount(true);
                    setAddSubAccountStep(1);
                    setSelectedUnit(item);
                  }}
                >
                  <FiPlus /> Add Subaccount{" "}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }

  function AddSubAccountNotFound() {
    return (
      <div style={{ margin: "20px 0" }}>
        <p align="center">
          No resident with specified name or email is found.{" "}
        </p>
        <span
          onClick={() =>
            history.push({
              pathname: removeLastFromPath(path) + "/add",
              state: {
                email,
              },
            })
          }
          className="Link"
        >
          Please register here.
        </span>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ marginLeft: "16px", marginTop: "10px" }}>
        Provider Information
      </h2>
      <Breadcrumb title="Globenet" />
      <div
        className="Container"
        style={{
          flex: "none",
          height: "200",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
              <table>
                <tr>
                  <td colSpan={5}>
                    <b>Provider Details</b>
                  </td>
                  <td>
                    <div className="row no-gutters w-100" style={{ justifyContent: 'space-between' }}>
                        <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
                            
                        </div>
                        <div className="col-auto d-flex flex-column">
                            <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                                pathname: editPath,
                                // state: data,
                            })} />
                        </div>
                    </div>
                  </td>
                </tr>
                <tr style={{ textAlign: "center"}}>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b></b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Provider Name</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>PIC</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Email</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Phone</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Created On</b>
                  </td>
                </tr>
                <tr style={{ textAlign: "center"}}>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                      Globenet
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                      Dadang jordan
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                      dadangjordan@gmail.com
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                      6288571647820
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                      2021-10-07 13:02:27
                  </td>
                </tr>
              </table>
            </div>
      </div>
      <div className="Container">
      <TableInternet
        noContainer={true}
        columns={columnsUnit}
        data={data?.items || []}
        loading={loading}
        pageCount={unit.total_pages}
        fetchData={useCallback(
          (page, limit, searchItem, sortField, sortType) => {
            // setLoading(true);
            dispatch(
              get(
                endpointAdmin +
                "/paymentperbuilding/list?status=all" +
                "&start_date=" +
                "" +
                "&end_date=" +
                "" + 
                "&building_id=" + 
                "" +
                "&bank=" +
                "" +
                "&sort_field=created_on&sort_type=DESC" +
                "&limit=" + 
                limit,

                (res) => {
                  console.log(res.data.data);
                  setData(res.data.data);
                  // setLoading(false);
                }
              )
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
          },
          // [dispatch, buildingid, bank, startdate, enddate]
          [dispatch]
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
                    // "Are you sure to end this promo?",
                    "Feature still under development",
                    () => {
                      // dispatch(deleteVA(row));
                    }
                  )
                );
              }
        }
      />
      </div>
    </>
  );
}

export default Component;
