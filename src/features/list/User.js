import React, { useState, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  dateTimeFormatterstriped,
} from "../../utils";
import { endpointGlobal } from "../../settings";
import { get, post, setInfo } from "../slice";


import Modal from "../../components/Modal";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Tab from "../../components/Tab";
import Filter from "../../components/Filter";
import Facilities from "../../components/cells/Facilities";
import { FiSearch } from "react-icons/fi";
// import { auth } from "firebase";

const userLoginHistoryColumn = [
  {
    Header: "Username",
    accessor: (row) => (
      // <Booking
      //   id={row.booking_id}
      //   data={row}
      //   items={[<b>{row.booking_number}</b>]}
      // />
      row.username
    ),
  },
  {
    Header: "Device",
    accessor: 'device',
  },
  {
    Header: "IP Address",
    accessor: 'ip_address',
  },
  {
    Header: "Login Date",
    accessor: (row) => {
      return (
        <div>
          <div>
              {row.created_on ? dateTimeFormatterstriped(row.created_on) : "-"}
          </div>
        </div>
      );
    },
  },
];

const userListColumns = [
  {
    Header: "Id",
    accessor: 'id',
  },
  {
    Header: "Username",
    accessor: 'username',
  },
  {
    Header: "User Level",
    accessor: 'user_level',
  },
  {
    Header: "Created Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.created_on ? dateTimeFormatterstriped(row.created_on) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },
];

const userLevelList = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
]

function Component({ view, title = "", pagetitle, canAdd, canDelete }) {

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState();
  const [loginHistory, setDataLoginHistory] = useState({ items: [] });
  const [modalPublish, toggleModalPublish] = useState(false);
  const handleShow = () => toggleModalPublish(true);

  const [type, setType] = useState("");

  const [refreshUser, setRefreshUser] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [userLevel, setUserLevel] = useState();


  const tabs = ["Login History", "User"];

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  return (
    <>
    <Modal
        isOpen={modalPublish}
        toggle={() => {
          toggleModalPublish(false);
        }}
        title="Add Transaction"
        okLabel={"Submit"}
        onClick={() => {
          dispatch(
            post(
              endpointGlobal + "/user/register",
              {
                username: username,
                password: password,
                user_level: userLevel,
              },
              (res) => {
                setRefreshUser(1)
                dispatch(
                  setInfo({
                    color: "success",
                    message: `${res.data.data} successfully add user.`,
                  })
                );
              },
              (err) => {
                dispatch(
                  setInfo({
                    color: "error",
                    message: `Error to released.`,
                  })
                );
                console.log("error");
              }
            )
          );

          toggleModalPublish(false);
        }}
      >
        <Input
          label="username"
          inputValue={username}
          type="text"
          setInputValue={setUsername}
          title="Username"
        />
        <Input
          label="password"
          inputValue={password}
          type="password"
          setInputValue={setPassword}
          title="Password"
        />
        <Input
          label="User Level"
          inputValue={userLevel}
          type="select"
          options={userLevelList}
          setInputValue={setUserLevel}
          title="user_level"
        />
      </Modal>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">User</h2>
      <div className="Container">
        <Tab
          labels={tabs}
          setTab={setType}
          activeTab={0}
          contents={[
            <Table
              columns={userLoginHistoryColumn}
              data={loginHistory?.data || []}
              fetchData={useCallback(
                (page, limit) => {
                  setLoading(true);
                  dispatch(
                    get(
                      endpointGlobal +
                        "/user/login/history" +
                        "?limit=" +
                        limit +
                        "&page=" +
                        (page + 1),
                      (res) => {
                        setDataLoginHistory(res.data);
                        setLoading(false);
                      }
                    )
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch]
              )}
              loading={loading}
              // pageCount={data?.total_pages}
              // totalItems={data?.total_items}
            />,
            <Table
              columns={userListColumns}
              data={userList?.items || []}
              fetchData={useCallback(
                (page, limit, searchItem) => {
                  setLoading(true);
                  dispatch(
                    get(
                      endpointGlobal +
                        "/user" +
                        "?search=" +
                        searchItem +
                        "&limit=" +
                        limit +
                        "&page=" +
                        (page + 1),
                      (res) => {
                        setUserList(res.data.data);
                      }
                    ),
                    setLoading(false)
                  );
                },
                [dispatch, refreshUser]
              )}
              loading={loading}
              // onClickDelete={
              //   view
              //     ? null
              //     : role === "bm" && !canDelete
              //     ? null
              //     : (row) => {
              //         dispatch(
              //           setConfirmDelete(
              //             "Are you sure to delete this user?",
              //             () => {
              //               dispatch(deleteFacility(row.facility_id));
              //               setToggle(!toggle);
              //             }
              //           )
              //         );
              //       }
              // }
              actions={
                view
                  ? null
                  : [
                      <Button
                        key="Add User"
                        label="Add User"
                        icon={<FiPlus />}
                        onClick={() => {
                          handleShow()
                        }}
                      />,
                    ]
              }
              // pageCount={data?.total_pages}
              // totalItems={data?.total_items}
            />,
          ]}
        />
      </div>
    </>
  );
}

export default Component;
