import React, { useEffect, useCallback, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FiX, FiSearch, FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../../components/Button";
import Table from "../../../../components/Table";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Filter from "../../../../components/Filter";
import TwoColumnResident from "../../../../components/TwoColumnResident";
import {
  toSentenceCase,
  removeLastFromPath,
  dateFormatter,
} from "../../../../utils";
import SectionSeparator from "../../../../components/SectionSeparator";
import Resident from "../../../../components/cells/Resident";

import {
  getResidentUnit,
  addResidentUnit,
  deleteSubaccount,
  deleteUnit,
  refresh,
} from "../../../slices/resident";
import { endpointAdmin, endpointResident } from "../../../../settings";
import { get, post } from "../../../slice";
import Loading from "../../../../components/Loading";
import { RiCalendarEventLine } from "react-icons/ri";
import { dateTimeFormatter } from "../../../../utils";
import Avatar from "react-avatar";

function Component({ id, view, canAdd, canUpdate, canDelete }) {
  const [addUnit, setAddUnit] = useState(false);
  const [delUnit, setDelUnit] = useState({
    delete: [],
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteUnit, setConfirmDeleteUnit] = useState(false);
  const [addUnitStep, setAddUnitStep] = useState(1);

  const [addSubAccount, setAddSubAccount] = useState(false);
  const [addSubAccountStep, setAddSubAccountStep] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [residents, setResidents] = useState([]);
  const [subAccount, setSubAccount] = useState({});
  const [ownershipStatus, setOwnershipStatus] = useState("");

  const [detailResident, setDetailResident] = useState([]);
  const [residentModal, setResidentModal] = useState(false);

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
  let { path } = useRouteMatch();

  const columnsUnit = [
    { Header: "ID", accessor: "unit_id" },
    { Header: "Building", accessor: "building_name" },
    {
      Header: "Unit Number",
      accessor: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setResidentModal(true)}
        >
          {row.number}
        </div>
      ),
    },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Period",
      accessor: (row) =>
        row.period_from && row.period_to
          ? dateFormatter(row.period_from) +
            " - " +
            dateFormatter(row.period_to)
          : "-",
    },
    {
      Header: "Type",
      accessor: (row) => row.unit_type + " - " + row.unit_size,
    },
  ];

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

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin + "/building/list/resident_unit?" + "unit_id=" + id,

        (res) => {
          setDetailResident(res.data.data.items);
        }
      )
    );
  }, [dispatch]);

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
        period_to: periodTo,
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
      <Modal
        isOpen={confirmDelete}
        btnDanger
        disableHeader={true}
        onClick={deleteSub}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to remove{" "}
        <b>{subAccount.firstname + " " + subAccount.lastname}</b> from this
        unit?
      </Modal>
      <Modal
        isOpen={confirmDeleteUnit}
        btnDanger
        disableHeader={true}
        onClick={() => {
          dispatch(deleteUnit(delUnit));
          setConfirmDeleteUnit(false);
        }}
        toggle={() => setConfirmDeleteUnit(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        <p className="h5">Are you sure you want to remove this unit?</p>
        {delUnit.delete.length > 1 && (
          <span className="text-danger">
            This will make remove all other subaccount.
          </span>
        )}
      </Modal>
      <Modal
        isOpen={addSubAccount}
        title={"Add Sub Account"}
        disableFooter={addSubAccountStep === 1}
        okLabel={addSubAccountStep !== 3 ? "Back" : "Add Sub Account"}
        cancelLabel={addSubAccountStep === 1 ? "Cancel" : "Back"}
        onClick={
          addSubAccountStep === 3 ? submitSubAccount : addUnitBackFunction
        }
        onClickSecondary={addSubBackFunction}
        disablePrimary={addSubAccountStep !== 3}
        toggle={() => {
          setAddSubAccount(false);
          setResidents([]);
        }}
      >
        {addSubAccountStep === 1 && (
          <>
            {/* <Input label="Search Resident Email or Name"
                        compact
                        fullwidth
                        icon={<FiSearch />}
                        inputValue={search} setInputValue={setSearch}
                    /> */}
            {/* <Filter
                        data={residents.map(el => {
                            return { label: el.firstname + ' ' + el.lastname, value: el };
                        })}
                        altDataComponent={search.length >= 1 && residents.length === 0 && AddSubAccountNotFound}
                        customComponent={SubAccountListItem}
                        onClick={(el) => {
                            setSubAccount(el.value);
                            setAddSubAccountStep(2);
                        }}
                    /> */}
            <Input
              label="Email"
              placeholder={"Input Resident Email"}
              type="email"
              compact
              inputValue={email}
              setInputValue={setEmail}
            />
            <Loading loading={checking}>
              <button
                style={{
                  marginTop: 12,
                }}
                type="button"
                onClick={() => {
                  setChecking(true);
                  dispatch(
                    post(
                      endpointResident + "/management/resident/check",
                      {
                        email: email,
                      },
                      (res) => {
                        setChecking(false);

                        let data = res.data.data;

                        if (data.id) {
                          setSubAccount(data);
                          setAddSubAccountStep(2);
                        } else {
                          setFound(false);
                        }
                      }
                    )
                  );
                }}
                disabled={!email}
              >
                Check
              </button>
            </Loading>
            {!found && <AddSubAccountNotFound />}
          </>
        )}
        {addSubAccountStep === 2 && (
          <>
            <Resident id={subAccount.id} data={subAccount} onClick={() => {}} />
            <hr />
            <p>Ownership status: </p>
            <Filter
              data={[
                { label: "Rent", value: "rent" },
                { label: "Own", value: "own" },
              ]}
              onClick={(el) => {
                setOwnershipStatus(el);
                setAddSubAccountStep(3);
                console.log(el);
              }}
            />
          </>
        )}
        {addSubAccountStep === 3 && (
          <>
            <Resident id={subAccount.id} data={subAccount} onClick={() => {}} />
            <Input
              fullwidth
              type="button"
              label={"Sub Account Ownership Status"}
              inputValue={ownershipStatus.label}
              onClick={() => {}}
            />
            {ownershipStatus.label === "Own" ? null : (
              <>
                <Input
                  label="Period From"
                  type="date"
                  name="period_from"
                  inputValue={periodFrom}
                  setInputValue={setPeriodFrom}
                />
                <Input
                  label="Period To"
                  type="date"
                  name="period_to"
                  inputValue={periodTo}
                  setInputValue={setPeriodTo}
                />
              </>
            )}
          </>
        )}
      </Modal>
      <Modal
        isOpen={addUnit}
        title={"Add Unit"}
        subtitle={"Register unit as a main resident"}
        disableFooter={role === "bm" ? addUnitStep === 2 : addUnitStep === 1}
        okLabel={addUnitStep !== 3 ? "Back" : "Add Unit"}
        cancelLabel={"Back"}
        onClick={addUnitStep === 3 ? submitFunction : addUnitBackFunction}
        onClickSecondary={addUnitBackFunction}
        disablePrimary={addUnitStep !== 3 || mainOwner}
        toggle={() => setAddUnit(false)}
      >
        {addUnitStep === 1 && (
          <>
            <Input
              label="Search Building"
              compact
              fullwidth
              icon={<FiSearch />}
              inputValue={search}
              setInputValue={setSearch}
            />
            <Filter
              data={buildings.map((el) => {
                return { label: el.name, value: el };
              })}
              onClick={(el) => {
                setSelectedBuilding(el);
                setAddUnitStep(2);
                setSearch("");
              }}
            />
          </>
        )}
        {addUnitStep === 2 && (
          <>
            <Input
              label="Selected Building"
              fullwidth
              type="button"
              inputValue={selectedBuilding.label}
              onClick={() => {}}
            />
            <SectionSeparator />
            <Input
              label="Search Unit Number"
              compact
              fullwidth
              icon={<FiSearch />}
              inputValue={search}
              setInputValue={setSearch}
            />
            <Filter
              data={units.map((el) => {
                return {
                  label:
                    "Room " +
                    el.number +
                    " - " +
                    toSentenceCase(el.section_type) +
                    " " +
                    el.section_name,
                  value: el,
                };
              })}
              onClick={(el) => {
                setSelectedUnit(el);
                setAddUnitStep(3);
                setSearch("");
              }}
            />
          </>
        )}
        {addUnitStep === 3 && (
          <>
            <form>
              <Input
                fullwidth
                label="Selected Building"
                type="button"
                inputValue={selectedBuilding.label}
                onClick={() => {}}
              />
              <Input
                fullwidth
                label="Selected Unit Number"
                type="button"
                inputValue={
                  "Room " +
                  selectedUnit.value.number +
                  " - " +
                  toSentenceCase(selectedUnit.value.section_type) +
                  " " +
                  selectedUnit.value.section_name +
                  " "
                }
                onClick={() => {}}
              />
              <SectionSeparator />
              {!mainOwner ? (
                <>
                  <Input
                    label="Status"
                    type="radio"
                    inputValue={status}
                    setInputValue={setStatus}
                    options={[
                      { value: "own", label: "Own" },
                      { value: "rent", label: "Rent" },
                    ]}
                  />
                  {status === "own" ? null : (
                    <>
                      <Input
                        label="Period From"
                        type="date"
                        name="period_from"
                        inputValue={periodFrom}
                        setInputValue={setPeriodFrom}
                      />
                      <Input
                        label="Period To"
                        type="date"
                        name="period_to"
                        inputValue={periodTo}
                        setInputValue={setPeriodTo}
                      />
                    </>
                  )}
                </>
              ) : mainOwner.id === id ? (
                <p>This resident is already the owner of this unit.</p>
              ) : (
                <>
                  <p>
                    This unit already has main owner, click below to get to the
                    main owner page :{" "}
                  </p>
                  <div
                    onClick={() => {
                      setAddUnitStep(1);
                      setAddUnit(false);
                    }}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Resident id={mainOwner.id} data={mainOwner} />
                  </div>
                </>
              )}
            </form>
          </>
        )}
      </Modal>
      <Modal
        width="660px"
        isOpen={residentModal}
        title="Resident Unit"
        toggle={() => setResidentModal(false)}
        cancelLabel={"Close"}
        disablePrimary
      >
        <div className="p-2">
          <div
            style={{
              paddingBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              color: "#838799",
            }}
            className="title-resident-detail"
          >
            Main Account
          </div>
          {detailResident.map((item) => (
            <div>
              {item.status === "Owner" ? (
                <>
                  <div className="Item-resident">
                    <Avatar
                      className="Item-avatar"
                      size="40"
                      src={item.photo}
                      name={item.firstname + " " + item.lastname}
                      round
                      email={item.photo ? null : item.email}
                    />
                    <>
                      <span> </span>
                      <TwoColumnResident
                        first={
                          <div>
                            <b>{item.firstname + " " + item.lastname}</b>
                            <p className="Item-subtext-resident">
                              {item.phone} {item.phone ? "|" : []} {item.email}
                            </p>
                          </div>
                        }
                        second={<Button color="Activated" label={item.status ? item.status : "-"} />}
                      />
                    </>
                  </div>
                </>
              ) : (
                []
              )}
            </div>
          ))}
          <hr />
        </div>
        <div className="p-2">
          <div
            style={{
              paddingBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              color: "#838799",
            }}
            className="title-resident-detail"
          >
            Sub Account
          </div>
          {detailResident.map((item) => (
            <div>
              {(detailResident.length > 0 && item.status !== "Owner") ? (
                <>
                  <div className="Item-resident">
                    <Avatar
                      className="Item-avatar"
                      size="40"
                      src={item.photo}
                      name={item.firstname + " " + item.lastname}
                      round
                      email={item.photo ? null : item.email}
                    />
                    <>
                      <span> </span>
                      <TwoColumnResident
                        first={
                          <div>
                            <b>{item.firstname + " " + item.lastname}</b>
                            <p className="Item-subtext-resident">
                              {item.phone} {item.phone ? "|" : []} {item.email}
                            </p>
                          </div>
                        }
                        second={<Button color="Activated" label={item.status ? item.status : "-"} />}
                      />
                    </>
                  </div>
                </>
              ) : (
                "No Unit Data Found"
              )}
            </div>
          ))}
        </div>
      </Modal>
      <Table
        totalItems={unit.items.length}
        noContainer={true}
        columns={columnsUnit}
        data={unit.items.map((el) =>
          el.level === "main"
            ? {
                expandable: true,
                subComponent: SubAccountList,
                ...el,
              }
            : el
        )}
        loading={loading}
        pageCount={unit.total_pages}
        fetchData={fetchData}
        filters={[]}
        actions={
          view
            ? null
            : canAdd && canUpdate
            ? [
                <Button
                  key="Add Unit"
                  label="Add Unit"
                  icon={<FiPlus />}
                  onClick={() => setAddUnit(true)}
                />,
              ]
            : null
        }
        onClickDelete={
          view
            ? null
            : canDelete
            ? (row) => {
                let del = row.unit_sub_account
                  ? row.unit_sub_account.map((item) => ({
                      unit_id: Number(row.unit_id),
                      owner_id: Number(item.id),
                    }))
                  : [];
                del.push({
                  unit_id: Number(row.unit_id),
                  owner_id: Number(id),
                });
                setDelUnit({
                  delete: del,
                });
                setConfirmDeleteUnit(true);
              }
            : undefined
        }
      />
    </>
  );
}

export default Component;
