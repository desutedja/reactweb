import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiDownload, FiPlus, FiUpload } from "react-icons/fi";

import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import TwoColumnResident from "../../../../components/TwoColumnResident";
import ListResident from "../../../../components/cells/ListResident";
import { toSentenceCase } from "../../../../utils";
import {
  deleteBuildingUnit,
  getBuildingUnit,
  editBuildingUnit,
  createBuildingUnit,
  getBuildingSection,
  getBuildingUnitType,
} from "../../../slices/building";
import { get, getErr, getFile, setConfirmDelete } from "../../../slice";
import { endpointAdmin } from "../../../../settings";
import UploadModal from "../../../../components/UploadModal";
import Avatar from "react-avatar";
import { useParams } from "react-router-dom";

function Component({ view, canUpdate, canDelete, canAdd, data }) {
  const [selectedRow, setRow] = useState({});
  const [edit, setEdit] = useState(false);
  const [addUnit, setAddUnit] = useState(false);

  const [sectionID, setSectionID] = useState("");
  const [unitTypeID, setUnitTypeID] = useState("");
  const [floor, setFloor] = useState("");
  const [number, setNumber] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [upload, setUpload] = useState(false);

  const [detailResident, setDetailResident] = useState([]);
  const [idUnit, setIdUnit] = useState();
  const [residentModal, setResidentModal] = useState(false);

  const { selected, loading, unit, section, unit_type, refreshToggle } =
    useSelector((state) => state.building);
  const { user } = useSelector((state) => state.auth);

  let { id } = useParams();

  const columnsUnit = [
    { Header: "ID", accessor: (row) => row.id },
    {
      Header: "Number",
      accessor: (row) => <ListResident id={row.id} data={row} />,
    },
    { Header: "Floor", accessor: "floor" },
    {
      Header: "Section",
      accessor: (row) =>
        toSentenceCase(row.section_type) + " " + row.section_name,
    },
    {
      Header: "Type",
      accessor: (row) => (
        <div>
          {(row.unit_type_name.length > 3
            ? toSentenceCase(row.unit_type_name)
            : row.unit_type_name.toUpperCase()) + " - "}
          {row.unit_size + " m"}
          <sup>2</sup>
        </div>
      ),
    },
  ];

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuildingSection(0, 100, "", selected));
    dispatch(getBuildingUnitType(0, 1000, "", selected));
  }, [dispatch, selected]);

  useEffect(() => {
    dispatch(
      getErr(
        endpointAdmin + "/building/list/resident_unit?" + "unit_id=" + idUnit,

        (res) => {
          setDetailResident(res.data.data.items);
        }
      )
    );
  }, [dispatch, idUnit]);

  function uploadResult(result) {
    return (
      <>
        {result.status == "Success" ? (
          <>
            <div>
              <h5>{result.message}</h5>
            </div>
          </>
        ) : (
          <>
            <div>
              <h5 class="red">{result.message}</h5>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <UploadModal
        open={upload}
        toggle={() => setUpload(false)}
        templateLink={
          "https://api.yipy.id/yipy-assets/asset-storage/document/E966EC86802F6640240FFA08D7B6C004.xlsx"
        }
        filename="building_unit_template.xlsx"
        uploadLink={endpointAdmin + "/management/building/bulk_unit"}
        uploadDataName="unit"
        resultComponent={uploadResult}
      />
      <Modal
        disableFooter={false}
        okLabel={edit ? "Save" : "Add"}
        title={edit ? "Edit Unit" : "Add Unit"}
        isOpen={addUnit}
        toggle={() => setAddUnit(false)}
        onClick={() => {
          edit
            ? dispatch(
                editBuildingUnit(
                  {
                    building_id: selected.id,
                    building_section: parseFloat(
                      sectionID ? sectionID : selectedRow.building_section
                    ),
                    unit_type: parseFloat(
                      unitTypeID ? unitTypeID : selectedRow.unit_type
                    ),
                    floor: floor ? floor : selectedRow.floor,
                    number: number ? number : selectedRow.number,
                  },
                  selectedRow.id
                )
              )
            : dispatch(
                createBuildingUnit({
                  building_id: selected.id,
                  building_section: parseFloat(sectionID),
                  unit_type: parseFloat(unitTypeID),
                  floor: floor,
                  number: number,
                })
              );
          setAddUnit(false);
          setEdit(false);
          setRow({});
          setSectionID("");
          setUnitTypeID("");
          setFloor("");
          setNumber("");
        }}
      >
        <form>
          {user.role === "sa" ? (
            <Input
              label="Number"
              inputValue={selectedRow.number ? selectedRow.number : number}
              setInputValue={setNumber}
            />
          ) : (
            <Input
              label="Number"
              inputValue={selectedRow.number ? selectedRow.number : number}
              setInputValue={setNumber}
              disabled={edit}
            />
          )}
          <Input
            label="Floor"
            inputValue={selectedRow.floor ? selectedRow.floor : floor}
            setInputValue={setFloor}
          />
          <Input
            label="Section"
            type="select"
            placeholder="Select Section"
            inputValue={
              selectedRow.building_section
                ? selectedRow.building_section
                : sectionID
            }
            setInputValue={setSectionID}
            options={section.items.map((el) => ({
              label: toSentenceCase(el.section_name),
              value: el.id,
            }))}
          />
          <Input
            label="Unit Type"
            type="select"
            placeholder="Select Unit Type"
            inputValue={
              selectedRow.unit_type ? selectedRow.unit_type : unitTypeID
            }
            setInputValue={setUnitTypeID}
            options={unit_type.items.map((el) => ({
              label:
                el.unit_type +
                " - " +
                el.unit_size +
                (el.trivial ? " - " + el.trivial : ""),
              value: el.id,
            }))}
          />
          <div
            style={{
              display: "flex",
              marginTop: 16,
              justifyContent: "center",
            }}
          ></div>
        </form>
      </Modal>

      <Modal
        width="660px"
        isOpen={residentModal}
        title="Resident Unit"
        toggle={() => {
          setResidentModal(false);
          setIdUnit();
        }}
        cancelLabel={"Close"}
        disablePrimary
      >
        {detailResident.length > 0 ? (
          <>
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
                                  {item.phone} {item.phone ? "|" : []}{" "}
                                  {item.email}
                                </p>
                              </div>
                            }
                            second={
                              <Button
                                color="Activated"
                                label={item.status ? item.status : "-"}
                              />
                            }
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
                  {item.status !== "Owner" ? (
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
                                  {item.phone} {item.phone ? "|" : []}{" "}
                                  {item.email}
                                </p>
                              </div>
                            }
                            second={
                              <Button
                                color="Activated"
                                label={item.status ? item.status : "-"}
                              />
                            }
                          />
                        </>
                      </div>
                    </>
                  ) : (
                    []
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          "No resident found for this unit"
        )}
      </Modal>
      <Table
        noContainer={true}
        columns={columnsUnit}
        data={unit.items}
        loading={loading}
        pageCount={unit.total_pages}
        fetchData={useCallback(
          (pageIndex, pageSize, search) =>
            dispatch(getBuildingUnit(pageIndex, pageSize, search, selected)),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [dispatch, selected, refreshToggle, upload]
        )}
        totalItems={unit.total_items}
        filters={[]}
        actions={
          view
            ? null
            : canAdd
            ? [
                <Button
                  key="Add Unit"
                  label="Add Unit"
                  icon={<FiPlus />}
                  onClick={() => {
                    setEdit(false);
                    setRow({});
                    setSectionID("");
                    setUnitTypeID("");
                    setFloor("");
                    setNumber("");

                    setAddUnit(true);
                  }}
                />,
                <Button
                  label="Upload Bulk"
                  icon={<FiUpload />}
                  onClick={() => setUpload(true)}
                />,
              ]
            : null
        }
        actionDownloads={
          view
            ? null
            : [
                <Button
                  fontWeight={500}
                  color="Download"
                  label="Download Units.csv"
                  icon={<FiDownload />}
                  onClick={() => {
                    dispatch(
                      getFile(
                        endpointAdmin +
                          "/building/unit/v2?limit=9999&page=1" +
                          "&building_id=" +
                          id +
                          "&search=" +
                          searchUnit +
                          "&sort_field=&sort_type=&" +
                          "export=" +
                          1,
                        "Data_Unit.csv",
                        (res) => {
                        },
                        (err) => {
                        }
                      )
                    );
                  }}
                />,
              ]
        }
        onClickList={
          view
            ? null
            : canUpdate
            ? (row) => {
                setIdUnit(row.id);
                setResidentModal(true);
              }
            : null
        }
        onClickDelete={
          view
            ? null
            : canDelete
            ? (row) => {
                dispatch(
                  setConfirmDelete("Are you sure to delete this item?", () =>
                    dispatch(deleteBuildingUnit(row))
                  )
                );
              }
            : undefined
        }
        onClickEdit={
          view
            ? null
            : canUpdate
            ? (row) => {
                setRow(row);
                setEdit(true);
                setAddUnit(true);
              }
            : null
        }
      />
    </>
  );
}

export default Component;
