import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import moment from "moment";

import "./style.css";
import { get } from "../slice";
import { useDispatch } from "react-redux";
import { getDatesRange } from "../../utils";
import { FiDownload, FiSearch } from "react-icons/fi";
import ReactHlsPlayer from "react-hls-player";
import { Button } from "reactstrap";
import { endpointAdmin } from "../../settings";

function Component() {
  const { auth } = useSelector((state) => state);
  const { user, role } = auth;
  const { group } = user;

  const [cctvPage, setCctvPage] = useState(1);
  const [cctvMaxPage, setCctvMaxPage] = useState(1);
  const [cctvLimit, setCctvLimit] = useState(10);
  const [cctvList, setCctvList] = useState([]);

  let dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin + "/cctv/admin?limit=" + cctvLimit + "&page=" + cctvPage,
        (res) => {
          const data = res.data.data;
          console.log(data);
          setCctvMaxPage(data.total_pages);
          setCctvList(data.items);
        },
        (err) => {
          console.log("FAILED GET LIST REPORT :", err);
        }
      )
    );
  }, [cctvPage]);

  const now = moment().format(`DDMMyyyy${parseInt(Math.random() * 100000)}`);
  return (
    <>
      <div className="row no-gutters">
        <div className="col-4">
          <h5 className="pl-4 ads-card-title">CCTV</h5>
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ maxHeight: 628, height: 628 }}
          >
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
                  onClick={() => console.log("a")}
                >
                  Manage CCTV
                </Button>
              </div>
            </div>
            {cctvList.length > 0 &&
              cctvList.map((el) => {
                return (
                  <div className="row mb-4 p-3">
                    <div className="col-6">
                      <div
                        style={{
                          width: "100%",
                          height: 100,
                          background: "grey",
                        }}
                      ></div>
                    </div>
                    <div
                      className="col-6"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div className="mb-2">
                        <strong>{el.alias}</strong>
                      </div>

                      {/* <div className="mb-2">6 December 2020, 12:30</div> */}

                      <div className="mt-4 mb-2">
                        <Button
                          className={
                            el.power === "on"
                              ? "cctv-active-button"
                              : "cctv-inactive-button"
                          }
                          onClick={() => console.log("a")}
                        >
                          {el.power === "on" ? "Turn Off" : "Turn On"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    <ReactHlsPlayer
                      url="http://admin:a1234567@118.151.221.98/ISAPI/Streaming/channels/101"
                      //   url="http://admin:a1234567@118.151.221.98/Streaming/channels/101/httpPreview"
                      autoplay={false}
                      controls={true}
                      width="100%"
                      height="auto"
                    />
                    <div className="m-2 mt-4">
                      <h3>Recording</h3>
                    </div>
                    <div className="m-3 row">
                      <div className="col-6">
                        <div className="">
                          <strong>Lobby Area</strong>
                        </div>
                        <div>Recording CCTV 6 Desember 2020, 12:00</div>
                      </div>
                      <div
                        className="col-6"
                        style={{
                          display: "flex",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <FiDownload size={30} />
                      </div>
                    </div>
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
