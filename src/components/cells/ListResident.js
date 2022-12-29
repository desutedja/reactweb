import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import TwoColumnResident from "../../components/TwoColumnResident";
import { getErr } from "../../features/slice";
import { endpointAdmin } from "../../settings";

function Component({ id, data = {} }) {
  const [detailResident, setDetailResident] = useState([]);
  const [residentModal, setResidentModal] = useState(false);
  const [idUnit, setIdUnit] = useState();

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getErr(
        endpointAdmin + "/building/list/resident_unit?" + "unit_id=" + idUnit,

        (res) => {
          setDetailResident(res.data.data.items);
        }
      )
    );
  }, [idUnit, dispatch]);

  return (
    <>
      <Modal
        width="660px"
        isOpen={residentModal}
        title="Resident Unit"
        toggle={() => setResidentModal(false)}
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
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIdUnit(data.id);
          setResidentModal(true);
        }}
      >
        {data.number}
      </div>
    </>
  );
}

export default Component;
