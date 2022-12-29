import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { TiAttachment } from "react-icons/ti";

import moment from "moment";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import IconButton from "../../components/IconButton";
import Tab from "../../components/Tab";
import Task from "../../components/cells/Task";
import Pill from "../../components/Pill";
import Row from "../../components/Row";
import TwoColumnNew from "../../components/TwoColumnNew";
import {
  updateMessages,
  setMessages,
  setRoom,
  setRoomID,
  getAdminChat,
  getPICBMChat,
  setReloadList,
} from "./slice";
import { FiCircle, FiSend } from "react-icons/fi";

import "./style.css";
import { post, get } from "../slice";
import { endpointAsset, endpointAdmin } from "../../settings";
import { RiTaskLine } from "react-icons/ri";
import { toSentenceCase } from "../../utils";
import { FaCircle, FaUser, FaUsers } from "react-icons/fa";
import Avatar from "react-avatar";
import { AvatarGroup } from "@material-ui/lab";

const topics = [
  {
    label: "All Category",
    value: "merchant_trx,service,security,billing,personal,help",
  },
  { label: "Service", value: "service" },
  { label: "Security", value: "security" },
  { label: "Billing", value: "billing" },
];

function Component() {
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [lastCommentId, setLastCommentId] = useState(null);

  const params = useParams();
  const history = useHistory();
  const uploadFile = useRef();

  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [roomInfoPrev, setRoomInfoPrev] = useState(false);
  const [image, setImage] = useState("");
  const [search, setSearch] = useState(params?.rf ? params.rf : "");

  const [participants, setParticipants] = useState([]);
  const [imageSend, setImageSend] = useState("");

  const { user, role } = useSelector((state) => state.auth);
  const {
    qiscus,
    room,
    rooms,
    roomID,
    messages,
    loadingRooms,
    reloadList,
    lastMessageOnRoom,
  } = useSelector((state) => state.chat);

  const [topic, setTopic] = useState(topics[0]);

  let dispatch = useDispatch();
  let messageBottom = useRef();

  useEffect(() => {
    !!messages.length &&
      messageBottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setLoadingParticipants(true);

    dispatch(
      get(endpointAdmin + "/chat/get_participant/" + roomID, (res) => {
        setParticipants(res.data.data);
        setLoadingParticipants(false);
      })
    );
  }, [dispatch, roomID]);

  useEffect(() => {
    var options = {
      // last_comment_id: 10,
      // after: false,
      limit: 50,
    };

    roomID && setLoadingMessages(true);
    roomID &&
      qiscus.loadComments &&
      qiscus
        .loadComments(roomID, options)
        .then(function (comments) {
          // On success
          dispatch(setMessages(comments.reverse()));
          setLoadingMessages(false);
          messageBottom.current.scrollIntoView();

          setLastCommentId(comments[comments.length - 1].id);

          qiscus.readComment(Number(roomID), comments[comments.length - 1].id);
          qiscus.receiveComment(
            Number(roomID),
            comments[comments.length - 1].id
          );
        })
        .catch(function (error) {
          // On error
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qiscus, room, roomID]);

  useEffect(() => {
    if (lastCommentId) {
      qiscus.readComment(Number(roomID), lastCommentId);
      qiscus.receiveComment(Number(roomID), lastCommentId);
    }
  }, [lastCommentId, qiscus, roomID]);

  useEffect(() => {
    var options = {
      // last_comment_id: 10,
      // after: false,
      limit: 50,
    };

    roomID &&
      qiscus.loadComments &&
      qiscus
        .loadComments(roomID, options)
        .then(function (comments) {
          // On success
          dispatch(setMessages(comments.reverse()));
          messageBottom.current.scrollIntoView();

          console.log(
            "LastMessageId:",
            comments[comments.length - 1].id,
            comments[comments.length - 1].message
          );
          console.log("RoomId: ", Number(roomID));

          qiscus.readComment(Number(roomID), comments[comments.length - 1].id);
          qiscus.receiveComment(
            Number(roomID),
            comments[comments.length - 1].id
          );
        })
        .catch(function (error) {
          // On error
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qiscus, reloadList]);

  useEffect(() => {
    let searchRoom = setTimeout(() => {
      if (role === "sa")
        dispatch(getAdminChat(topic.value, 0, 50, params?.rf || search));
      else dispatch(getPICBMChat(topic.value, 0, 50, params?.rf || search));
    }, 1000);

    return () => {
      clearTimeout(searchRoom);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, reloadList, topic, search]);

  const sendMessage = (text = "", type = "", payload) => {
    text = imageSend ? "[file] " + imageSend + " [/file]" : "";
    type = imageSend ? "file_attachment" : "";
    payload = {
      url: imageSend,
    };

    const messageData = message ? message : text;

    if (messageData.length === 0) return;
    setLoadingSend(true);
    qiscus
      .sendComment(roomID, messageData, null, type, payload, {
        sender_user: {
          name: user.firstname + " " + user.lastname,
          role: role === "sa" ? "centratama" : "staff_pic_bm",
        },
        merchant: null,
        building: user.building_name,
        management: user.management_name,
        data_type: type === "file_attachment" && "image",
        url: payload?.url,
        message: message,
      })
      .then(function (comment) {
        // On success
        dispatch(updateMessages([comment]));
        setRefresh(!refresh);
        setMessage("");
        setImageSend("");
        setLoadingSend(false);
      });
  };

  function isImage(file) {
    const f = file.split(".");
    const ext = f[f.length - 1].toUpperCase();
    return (
      ext === "JPG" ||
      ext === "PNG" ||
      ext === "GIF" ||
      ext === "JPEG" ||
      ext === "TIFF" ||
      ext === "EPS"
    );
  }

  return (
    <>
      <Modal
        disableFooter
        disableHeader
        isOpen={preview}
        toggle={() => setPreview(false)}
      >
        <img
          src={image}
          alt="attachment"
          style={{
            maxHeight: 600,
            maxWidth: "100%",
            objectFit: "cover",
          }}
        />
      </Modal>
      <Modal
        disableFooter
        disableHeader
        isOpen={roomInfoPrev}
        toggle={() => setRoomInfoPrev(false)}
      >
        <>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Room
          </p>
          <p
            style={{
              marginBottom: 24,
            }}
          >
            {" "}
            QiscusID: {roomID}
          </p>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Participants
          </p>
          <Loading loading={loadingParticipants}>
            {typeof participants !== "undefined" &&
              participants !== null &&
              participants.map((el, index) => (
                <div key={index} className="Participant">
                  <img
                    alt="avatar"
                    className="MessageAvatar"
                    src={el.avatar_url}
                    style={{
                      marginRight: 8,
                      marginBottom: 4,
                      borderRadius: 4,
                    }}
                  />
                  {el.username}
                </div>
              ))}
          </Loading>
        </>
      </Modal>
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 2,
          }}
        >
          <div
            style={{
              flex: 1,
              paddingRight: 16,
              paddingLeft: 16,
              overflow: "scroll",
            }}
          >
            <Loading loading={loadingMessages}>
              {messages.length > 0 && (
                <div className="Container mt-4 mb-5">
                  <div className="row no-gutter w-100">
                    <div className="col-10">
                      <div className="col Chat-title">{room.room_name}</div>
                      <div className="col Room-gray-text">
                        ID Task: {room.task_id ? room.task_id : "-"}
                      </div>
                    </div>
                    <div
                      className="col-2 float-right Chat-subtitle cursor-pointer"
                      onClick={() => {
                        setRoomInfoPrev(true);
                      }}
                      style={{ margin: "0px", padding: "0px" }}
                    >
                      <div
                        style={{ justifyContent: "center", display: "flex" }}
                      >
                        <AvatarGroup max={3}>
                          <Avatar
                            style={{ borderWidth: 2, borderColor: "#000080" }}
                            round
                            size="24"
                            alt="Geeksforgeeks"
                            src={require("./../../assets/avatar_default.jpg")}
                          />
                          <Avatar
                            style={{ borderWidth: 2, borderColor: "#000080" }}
                            round
                            size="24"
                            alt="Random Name"
                            src={require("./../../assets/avatar_default.jpg")}
                          />
                          <Avatar
                            style={{ borderWidth: 2, borderColor: "#000080" }}
                            round
                            size="24"
                            alt="Random Name"
                            src={require("./../../assets/avatar_default.jpg")}
                          />
                        </AvatarGroup>
                      </div>
                      <div>Room Info</div>
                    </div>
                  </div>
                </div>
              )}
              {messages.length > 0 ? (
                messages.map((el, index) => {
                  const ownName = user.firstname + " " + user.lastname;
                  const currentName = el.extras.sender_user
                    ? el.extras.sender_user.name
                    : el.extras.name;
                  const beforeName = !messages[index - 1]
                    ? ""
                    : messages[index - 1].extras.sender_user
                    ? messages[index - 1].extras.sender_user.name
                    : messages[index - 1].extras.name;

                  return (
                    <div
                      key={el.id}
                      className={
                        currentName === ownName
                          ? "MessageContainer-own"
                          : "MessageContainer"
                      }
                    >
                      {index > 0 && beforeName === currentName ? (
                        <div className="MessageAvatar" />
                      ) : (
                        <img
                          alt="avatar"
                          className="MessageAvatar"
                          src={el.user_avatar_url}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            currentName === ownName ? "flex-end" : "flex-start",
                        }}
                      >
                        {index > 0 &&
                        beforeName === currentName ? null : currentName ===
                          ownName ? (
                          <div
                            className="MessageUsername"
                            style={{ cursor: "pointer", display: "flex" }}
                            onClick={() => {
                              const userrole = el.email.split("-")[0];
                              const userid = el.email.split("-")[2];

                              if (userrole === "resident") {
                                history.push(
                                  "/" + role + "/resident/" + userid
                                );
                              }
                              if (userrole === "staff") {
                                history.push("/" + role + "/staff/" + userid);
                              }
                              if (userrole === "centratama") {
                                history.push("/" + role + "/admin/" + userid);
                              }
                            }}
                          >
                            <span className="roleFlag">
                              {el.email.split("-")[0] === "centratama"
                                ? toSentenceCase(currentName)
                                : toSentenceCase(el.email.split("-")[0])}
                            </span>
                            <span className="dotIcon">
                              <FaCircle />
                            </span>
                            {currentName}
                          </div>
                        ) : (
                          <div
                            className="MessageUsername"
                            style={{ cursor: "pointer", display: "flex" }}
                            onClick={() => {
                              const userrole = el.email.split("-")[0];
                              const userid = el.email.split("-")[2];

                              if (userrole === "resident") {
                                history.push(
                                  "/" + role + "/resident/" + userid
                                );
                              }
                              if (userrole === "staff") {
                                history.push("/" + role + "/staff/" + userid);
                              }
                              if (userrole === "centratama") {
                                history.push("/" + role + "/admin/" + userid);
                              }
                            }}
                          >
                            {currentName}
                            <span className="dotIcon">
                              <FaCircle />
                            </span>
                            <span className="roleFlag">
                              {el.email.split("-")[0] === "centratama"
                                ? toSentenceCase(currentName)
                                : toSentenceCase(el.email.split("-")[0])}
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection:
                              currentName === ownName ? "row-reverse" : "row",
                          }}
                        >
                          {/* if type is text */}

                          {el.type === "text" && (
                            <div>
                              {el.extras.task_id && (
                                <>
                                  <div>
                                    <div className="Message-attached">
                                      <div className="row no-gutters align-items-center">
                                        <div className="col-auto">
                                          <div
                                            className="w-auto h-auto"
                                            style={{ fontSize: "30px" }}
                                          >
                                            <RiTaskLine />
                                          </div>
                                        </div>
                                        <div className="col">
                                          <Task
                                            id={el.extras.task_id}
                                            data={el.extras}
                                            items={[
                                              el.extras.title,
                                              <small className="roleFlag">
                                                {el.extras.ref_code}
                                              </small>,
                                            ]}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div
                                    className={
                                      currentName === ownName
                                        ? "Message-own"
                                        : "Message"
                                    }
                                  >
                                    <RiTaskLine />
                                    <Task
                                      id={el.extras.task_id}
                                      data={el.extras}
                                      items={[
                                        el.extras.title,
                                        <small>{el.extras.ref_code}</small>,
                                      ]}
                                    />
                                  </div> */}
                                </>
                              )}
                              <div
                                className={
                                  currentName === ownName
                                    ? "Message-own"
                                    : "Message"
                                }
                              >
                                {el.message}
                                <div className="MessageTimeNow">
                                  {moment.unix(el.unix_timestamp).fromNow()}
                                </div>
                              </div>
                            </div>
                          )}

                          {el.type === "file_attachment" && (
                            <div>
                              {isImage(el.message.split(" ")[1]) ? (
                                <div
                                  className={
                                    currentName === ownName
                                      ? "Message-own"
                                      : "Message"
                                  }
                                  style={{
                                    flexDirection: "column",
                                  }}
                                >
                                  <img
                                    onClick={() => {
                                      setImage(el.message.split(" ")[1]);
                                      setPreview(true);
                                    }}
                                    alt="Attachment"
                                    src={el.message.split(" ")[1]}
                                    width="150"
                                    style={{
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                    }}
                                  />
                                  <div>{el.extras.message}</div>
                                </div>
                              ) : (
                                <div
                                  className={
                                    currentName === ownName
                                      ? "Message-own"
                                      : "Message"
                                  }
                                >
                                  <TiAttachment />{" "}
                                  <a href={el.message.split(" ")[1]}>
                                    Download Attachment
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {messages[index + 1]?.username !== el.username && (
                          <div
                            style={{
                              height: 12,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <h3
                  style={{
                    color: "grey",
                    textAlign: "center",
                    marginTop: 48,
                  }}
                >
                  Please select a room to load messages.
                </h3>
              )}
            </Loading>
            <div
              style={{ float: "left", clear: "both" }}
              ref={messageBottom}
            ></div>
          </div>
          <form
            className="Container"
            style={{
              flex: "none",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              message && sendMessage();
            }}
          >
            {imageSend && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  alt="Attachment"
                  src={imageSend}
                  width="150"
                  style={{ padding: "10px" }}
                />
                <Button
                  label="Cancel"
                  color="danger"
                  onClick={() => {
                    setImageSend("");
                  }}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
              }}
            >
              <Input
                compact
                label="Send a message.."
                inputValue={message}
                setInputValue={setMessage}
              />
              <Loading
                loading={qiscus ? loadingSend || !qiscus.sendComment : true}
              >
                <IconButton>
                  <input
                    ref={uploadFile}
                    type="file"
                    style={{
                      display: "none",
                    }}
                    onChange={async () => {
                      // setMessage('');
                      let file = uploadFile.current.files[0];

                      // setMessage('Uploading file...');
                      setLoadingSend(true);

                      let formData = new FormData();
                      formData.append("file", file);

                      dispatch(
                        post(
                          endpointAsset + "/file/upload",
                          formData,
                          (res) => {
                            setLoadingSend(false);
                            setImageSend(res.data.data.url);
                          },
                          (err) => {
                            // setMessage('');
                            setLoadingSend(false);
                          }
                        )
                      );
                    }}
                  />
                  <TiAttachment
                    onClick={() => {
                      uploadFile.current.click();
                    }}
                    style={{ marginLeft: "10" }}
                    size="30"
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    sendMessage();
                  }}
                >
                  <FiSend style={{ marginLeft: "10" }} size="30" />
                </IconButton>
              </Loading>
            </div>
          </form>
        </div>
        <div
          className="Container"
          style={{
            marginLeft: 16,
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Tab
            title={"Chat"}
            contents={[
              <>
                <Loading
                  loading={loadingRooms}
                  style={{
                    position: "absolute",
                    right: 0,
                    left: 0,
                    backgroundColor: "#fffa",
                  }}
                />
                <div
                  style={{
                    marginBottom: 12,
                  }}
                >
                  <Input
                    compact
                    label="Search title"
                    inputValue={search}
                    setInputValue={setSearch}
                  />
                  {role === "bm" && (
                    <Input
                      type="select"
                      compact
                      options={topics}
                      inputValue={topic.value}
                      setInputValue={(value) => {
                        setTopic(topics.find((el) => el.value === value));
                      }}
                    />
                  )}
                </div>
                {rooms.map((el, index) => {
                  const opt = el.room_options
                    ? JSON.parse(el.room_options)
                    : {};

                  return (
                    <div
                      className={
                        "Room" + (el.room_id === roomID ? " selected" : "")
                      }
                      onClick={
                        el.room_id === roomID
                          ? null
                          : () => {
                              dispatch(setRoom(el));
                              dispatch(setRoomID(el.room_id));
                              // dispatch(setRoomUniqueID(el.unique_id));
                              if (Number(el.unread_message) === 0) return;
                              dispatch(setReloadList());
                            }
                      }
                    >
                      <div className="Room-left">
                        <div className="Room-title">
                          <p className="Room-name">
                            {el.room_name > el.room_name.substring(0, 30)
                              ? el.room_name.substring(0, 30) + "..."
                              : el.room_name}
                          </p>
                          {/* <p className="Room-subtitle">
                            {el.last_message_user ? el.last_message_user + ": " : ""} 
                            {el.last_message
                              ? el.last_message >
                                el.last_message.substring(0, 30)
                                ? el.last_message.substring(0, 30) + "..."
                                : el.last_message
                              : "Message not found"}
                          </p> */}
                          {/* {opt && opt.ref_code && (
                            <p className="Room-subtitle">
                              Task Code:{" "}
                              <a href={"/" + role + "/task/" + opt.task_id}>
                                {opt.ref_code > opt.ref_code.substring(0, 15)
                                  ? opt.ref_code.substring(0, 15) + "..."
                                  : opt.ref_code}
                              </a>
                            </p>
                          )} */}
                        </div>
                        {/* TODO: get information about user in last_comment.extras */}
                        <p className="Room-message">
                          {el.last_message_user +
                            (el.last_message
                              ? ": " +
                                (el.last_message?.length > 20
                                  ? el.last_message?.slice(0, 20) + "..."
                                  : el.last_message)
                              : "Message not found") +
                            (el.last_message_timestamp === 0
                              ? ""
                              : " (" +
                                moment
                                  .unix(el.last_message_timestamp)
                                  .fromNow() +
                                ")")}
                        </p>
                        <Row>
                          <TwoColumnNew
                            first={
                              <div className="Room-container-info">
                                {toSentenceCase(el.topic)}
                              </div>
                            }
                            second={
                              <div className="Room-container-info">
                                <a
                                  className="Room-gray-text"
                                  href={"/" + role + "/task/" + opt.task_id}
                                >
                                  ID Task: {opt.ref_code}
                                </a>
                              </div>
                            }
                          />
                        </Row>
                      </div>
                      <div className="Room-right">
                        {el.unread_message !== "0" && (
                          <p className="Room-unread">{el.unread_message}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>,
              <>
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  Room
                </p>
                <p
                  style={{
                    marginBottom: 24,
                  }}
                >
                  {" "}
                  QiscusID: {roomID}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  Participants
                </p>
                <Loading loading={loadingParticipants}>
                  {typeof participants !== "undefined" &&
                    participants !== null &&
                    participants.map((el, index) => (
                      <div key={index} className="Participant">
                        <img
                          alt="avatar"
                          className="MessageAvatar"
                          src={el.avatar_url}
                          style={{
                            marginRight: 8,
                            marginBottom: 4,
                            borderRadius: 4,
                          }}
                        />
                        {el.username}
                      </div>
                    ))}
                </Loading>
              </>,
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default Component;
