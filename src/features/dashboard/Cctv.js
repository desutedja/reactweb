import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import moment from "moment";

import "./style.css";
import { get, setConfirmDelete } from "../slice";
import { useDispatch } from "react-redux";
import Input from "../../components/Input";
import Form from "../../components/Form";
import Modal from "../../components/Modal";
import Filter from "../../components/Filter";
import { createCctv, editCctv, deleteCctv } from "../slices/building";
import { FiSearch } from "react-icons/fi";
import { Button } from "reactstrap";
import { endpointAdmin } from "../../settings";
import { FiTrash, FiEdit } from "react-icons/fi";

function Component() {
  const { auth } = useSelector((state) => state);
  const { user, role } = auth;
  const { group } = user;

  const [cctvPage, setCctvPage] = useState(1);
  const [cctvMaxPage, setCctvMaxPage] = useState(1);
  const [cctvLimit, setCctvLimit] = useState(100);
  const [cctvList, setCctvList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [addCctv, setAddCctv] = useState(false);
  const [selected, setSelected] = useState({});
  const [loadDefault, setLoadDefault] = useState(5);
  const [selectedRow, setRow] = useState({});
  const [modalManagement, setModalManagement] = useState(false);
  const [managements, setManagements] = useState([]);
  const [managementChose, setManagementChose] = useState({});
  const [managementID, setManagementID] = useState("");
  const [managementName, setManagementName] = useState("");
  const [search, setSearch] = useState("");
  const [host, setHost] = useState("");
  const [residentAccess, setResidentAccess] = useState(null);
  const [power, setPower] = useState(null);
  const [channel, setChannel] = useState("");
  const [confirmDeleteCctv, setConfirmDeleteCctv] = useState(false);
  const [chosenCctv, setChosenCctv] = useState({});

  let dispatch = useDispatch();
  const history = useHistory();
  const { refreshToggle } = useSelector((state) => state.building);
  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    console.log(selectedRow);
    setResidentAccess(selectedRow.resident_access);
    setPower(selectedRow.power);
  }, [selectedRow]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin + "/cctv/admin?limit=" + cctvLimit + "&page=" + cctvPage,
        (res) => {
          const data = res.data.data;
          console.log(data);
          if (data.items.length > 0) {
            data.items.map(async (el) => {
              // const username = el.username;
              // const password = el.password;
              // const credentials = btoa(username + ":" + password);
              // console.log(el.thumbnail);
              // const getThumbnail = await Axios.get(el.thumbnail, {
              //   // headers: {
              //   //   Authorization: "Basic " + credentials, //the token is a variable which holds the token
              //   // },

              //   auth: {
              //     username: username, //This could be your email
              //     password: password,
              //   },
              //   withCredentials: true,
              // });
              return {
                ...el,
                // thumbBase64: `data:${
                //   getThumbnail.headers["content-type"]
                // };base64,${new Buffer(getThumbnail.data).toString("base64")}`,
              };
            });
          }
          setCctvMaxPage(data.total_pages);
          setCctvList([...data.items]);
        },
        (err) => {
          console.log("FAILED GET LIST REPORT :", err);
        }
      )
    );
  }, [cctvPage, addCctv, refreshToggle]);

  useEffect(() => {
    (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?limit=" +
            loadDefault +
            "&page=1" +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;
            const totalItems = res.data.data.total_items;
            const currentItems = totalItems - data.length;
            console.log(res.data.data.items);
            let formatted = data.map((el) => ({
              label: el.name + " by " + el.management_name,
              value: el.management_building_id,
              clickable: true,
            }));
            if (currentItems > 0 && !search) {
              formatted.push({
                label: `Load more (${currentItems})`,
                className: "load-more",
                clickable: false,
              });
              setManagements(formatted);
            } else setManagements(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, loadDefault]);

  const now = moment().format(`DDMMyyyy${parseInt(Math.random() * 100000)}`);
  return (
    <>
      <Modal
        isOpen={addCctv}
        toggle={() => setAddCctv(false)}
        title={edit ? "Edit CCTV" : "Add CCTV"}
        disableFooter={true}
        okLabel={edit ? "Save" : "Add"}
      >
        <Form
          noContainer={true}
          showCancel={true}
          onCancel={() => {
            setAddCctv(false);
            setEdit(false);
            setRow({});
          }}
          onSubmit={(data) => {
            data.host = host;
            data.channel = channel;
            edit
              ? dispatch(
                  editCctv(
                    {
                      management_building_id:
                        selectedRow.management_building_id,
                      building_name: selected.name,
                      ...data,
                      status: managementChose.status,
                    },
                    selectedRow.id
                  ),
                  (res) => {}
                )
              : // console.log({
                //     "building_id": selected.id, building_name: selected.name, ...data})
                dispatch(
                  createCctv({
                    building_id: selected.id,
                    building_name: selected.name,
                    ...data,
                  })
                );
            setAddCctv(false);
            setEdit(false);
            setRow({});
          }}
        >
          <Modal
            width="400px"
            disableFooter={true}
            isOpen={modalManagement}
            toggle={() => setModalManagement(false)}
          >
            <Input
              label="Search"
              inputValue={search}
              setInputValue={setSearch}
              placeholder="Type managements..."
            />
            <Filter
              data={managements}
              onClick={(el) => {
                if (el.clickable) {
                  console.log(el);
                  setManagementID(el.value);
                  setManagementName(el.label);
                  setModalManagement(false);
                  return;
                }
                setLoadDefault(loadDefault + 5);
              }}
            />
          </Modal>
          <Input
            label="Management Building ID"
            hidden
            inputValue={
              managementID ? managementID : selectedRow.management_building_id
            }
            setInputValue={setManagementID}
          />
          <Input
            label="Management Name"
            hidden
            inputValue={
              managementName ? managementName : selectedRow.management_name
            }
            setInputValue={setManagementName}
          />
          <Input
            label="Select Management"
            type="button"
            inputValue={
              managementName ? managementName : selectedRow.management_name
            }
            onClick={() => setModalManagement(true)}
            disabled={edit}
          />
          <Input
            label="Channel ID"
            name="channel"
            inputValue={selectedRow.channel ? selectedRow.channel : channel}
            setInputValue={setChannel}
          />
          <Input label="Alias" inputValue={selectedRow.alias} />
          <Input
            type="text"
            label="Host"
            name="host"
            inputValue={selectedRow.host ? selectedRow.host : host}
            setInputValue={(value) => setHost(value)}
          />
          <Input label="Port" inputValue={selectedRow.port} />
          <Input label="Username" inputValue={selectedRow.username} />
          <Input label="Password" inputValue={selectedRow.password} />
          <Input label="Path" inputValue={selectedRow.path} />
          <Input
            label="Protocol"
            type="select"
            options={[
              { label: "RTSP", value: "rtsp" },
              { label: "HTTP", value: "http" },
              { label: "HTTPS", value: "https" },
            ]}
            inputValue={selectedRow.protocol}
          />
          <Input
            label="Resident Access"
            type="radio"
            name="resident_access"
            inputValue={
              residentAccess !== null
                ? residentAccess
                : selectedRow.resident_access
            }
            setInputValue={(val) => setResidentAccess(val)}
            options={[
              { value: "yes", label: "Yes", id: "y_access" },
              { value: "no", label: "No", id: "n_access" },
            ]}
          />
          <Input
            label="Power"
            type="radio"
            name="power"
            inputValue={power !== null ? power : selectedRow.power}
            setInputValue={(val) => setPower(val)}
            options={[
              { value: "on", label: "On", id: "on_power" },
              { value: "off", label: "Off", id: "off_power" },
            ]}
          />
        </Form>
      </Modal>

      <Modal
        disableHeader={true}
        isOpen={confirmDeleteCctv}
        onClick={() => {
          dispatch(deleteCctv(chosenCctv));
          setChosenCctv({});
          setConfirmDeleteCctv(false);
        }}
        onClickSecondary={() => setConfirmDeleteCctv(false)}
        okLabel={"Sure"}
      >
        <h4
          className="mb-3"
          style={{
            fontSize: "1.2rem",
          }}
        >
          Are you sure to delete <strong>{chosenCctv.alias}</strong> ?
        </h4>
      </Modal>
      <div className="row no-gutters">
        <div className="col-4">
          <h5 className="pl-4 ads-card-title">CCTV</h5>
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ maxHeight: 628, height: 628 }}
          >
            {role === "sa" && (
              <div className="row mb-4 p-3">
                <div className="col-12 center">
                  <Button
                    className="cctv-active-button"
                    style={{
                      minWidth: 200,
                      maxWidth: 200,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                    onClick={() => {
                      setAddCctv(true);
                      setRow({});
                      setEdit(false);
                      setHost("");
                      setChannel("");
                      setPower(null);
                      setResidentAccess(null);
                    }}
                  >
                    <FiEdit /> Add CCTV
                  </Button>
                </div>
              </div>
            )}
            <div className="cctv-list-scroll">
              {cctvList.length > 0 &&
                cctvList.map((el) => {
                  return (
                    <div className="row mb-4 p-3">
                      <div className="col-6">
                        <img
                          src={el.default_thumbnail}
                          style={{ height: 100 }}
                        />
                        {/* <div
                          style={{
                            width: "100%",
                            height: 100,
                            background: "grey",
                          }}
                        ></div> */}
                      </div>
                      <div
                        className="col-6"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <div className="mb-2">
                          <strong>{el.alias}</strong>
                        </div>

                        <div className="mb-2">Power : {el.power}</div>

                        <div className="mt-4 mb-2 row">
                          <div className="col-6">
                            <Button
                              className={"cctv-active-button"}
                              onClick={() => {
                                console.log(el);
                                setEdit(true);
                                setAddCctv(true);
                                setRow(el);
                                setHost(el.host);
                                setChannel(el.channel);
                              }}
                              style={{
                                width: 100,
                                maxWidth: 100,
                                minWidth: 100,
                              }}
                            >
                              Edit CCTV
                              {/* {el.power === "on" ? "Turn Off" : "Turn On"} */}
                            </Button>
                          </div>
                          <div className="col-4 ml-2">
                            <Button
                              className={"cctv-active-button"}
                              onClick={() => {
                                setConfirmDeleteCctv(true);
                                setChosenCctv(el);
                                // dispatch(deleteCctv(el, history));
                              }}
                              style={{ width: 30, maxWidth: 30, minWidth: 30 }}
                            >
                              <FiTrash />
                              {/* {el.power === "on" ? "Turn Off" : "Turn On"} */}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="col-8">
          <h5 className="pl-4 ads-card-title">CCTV</h5>
          <div
            className="Container flex-column pb-5 pr-4"
            // style={{ maxHeight: 628, height: 628 }}
          >
            <div className="row mb-4">
              <div className="col-12">
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "0.75rem 1.25rem",
                    }}
                  >
                    <div className="col-8" style={{ padding: 0 }}>
                      <h3>Live View</h3>
                    </div>
                  </div>
                  <div>
                    <video width="100%" autoPlay controls>
                      <source
                        src="https://api.yipy.id/yipy-assets/asset-storage/document/AB8E43D5F78CC6F9324A23876ED2C4A3.mp4"
                        type="video/mp4"
                      />
                    </video>
                    {/* <ReactHlsPlayer
                      url="https://api.yipy.id/yipy-assets/asset-storage/document/AB8E43D5F78CC6F9324A23876ED2C4A3.mp4"
                      //   url="http://admin:a1234567@118.151.221.98/Streaming/channels/101/httpPreview"
                      autoplay={true}
                      controls={true}
                      width="100%"
                      height="auto"
                    /> */}
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;

const InputSearch = (props) => (
  <div className="search-input mb-3">
    <label htmlFor="search">
      <FiSearch />
    </label>
    <input
      className="py-2"
      {...props}
      id="search"
      type="text"
      placeholder="Search"
    />
  </div>
);

const ListAds = ({ data }) => {
  const history = useHistory();
  const { role } = useSelector((state) => state.auth);
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      <button
        onClick={() => undefined}
        className="ml-2"
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        i
      </button>
      <div
        style={{ minWidth: 400 }}
        className={"list-modal-hover" + (modalHover ? " on" : "")}
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {data.map((item, i) => (
          <div className="p-2" style={{ fontSize: 14 }}>
            {i + 1 + ". " + item.content_name}
          </div>
        ))}
      </div>
    </div>
  );
};
