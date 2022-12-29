import React, { useState, Fragment, useEffect, Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import parser from "html-react-parser";
import {
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import {
  MdChatBubble,
  MdChatBubbleOutline,
  MdNotifications,
  MdSettings,
} from "react-icons/md";
import { Switch, useHistory, useRouteMatch, Route } from "react-router-dom";
import QiscusSDKCore from "qiscus-sdk-core";
import { Toast, ToastHeader, ToastBody } from "reactstrap";

import { messaging } from "../../../firebase";
import Loading from "../../../components/Loading";
import Row from "../../../components/Row";
import NotFound from "../../../components/NotFound";
import CustomAlert from "../../../components/CustomAlert";
import IconButton from "../../../components/IconButton";
import Info from "../../../components/Info";
import Modal from "../../../components/Modal";

import { toSentenceCase, dateTimeFormatter } from "../../../utils";
import {
  closeAlert,
  setConfirmDelete,
  setNotif,
  setBanks,
  get,
  post,
} from "../../slice";
import { setNotificationData } from "../../../features/slices/notification";
import { setQiscus, setUnread, setReloadList } from "../../chat/slice";
import { logout } from "../../auth/slice";
import {
  endpointResident,
  endpointManagement,
  endpointAdmin,
} from "../../../settings";

const Qiscus = new QiscusSDKCore();

// const clinkLogo = require("../../../assets/clink_logo.png");
const clinkLogo = require("../../../assets/yipy-logo-color.png");
const clinkLogoSmall = require("../../../assets/yipy-logo-color.png");

function Component({ role, children }) {
  const [menuWide, setMenuWide] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [profile, setProfile] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const { alert, title, subtitle, content, confirmDelete, notif } = useSelector(
    (state) => state.main
  );
  const { items } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  const { qiscus, unread, messages } = useSelector((state) => state.chat);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    if (!messaging) return;
    messaging.requestPermission();
    //   .then((currentToken) => {
    //   if (currentToken) {
    //     console.log("Current token: ", currentToken);

    //     dispatch(
    //       post(endpointAdmin + "/management/update_fcm", {
    //         fcm_id: currentToken,
    //         user_id: user.id,
    //       })
    //     );
    //   } else {
    //     console.log(
    //       "No Instance ID token available. Request permission to generate one."
    //     );
    //   }
    // })
    // .catch((err) => {
    //   console.log("An error occurred while retrieving token. ", err);
    // });

    messaging
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log("Current token: ", currentToken);

          dispatch(
            post(endpointAdmin + "/management/update_fcm", {
              fcm_id: currentToken,
              user_id: user.id,
            })
          );
        } else {
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });

    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((refreshedToken) => {
          console.log("Token refreshed.");
          console.log("Current token: ", refreshedToken);

          dispatch(
            post(endpointAdmin + "/management/update_fcm", {
              fcm_id: refreshedToken,
              user_id: user.id,
            })
          );
        })
        .catch((err) => {
          console.log("Unable to retrieve refreshed token ", err);
        });
    });

    messaging.onMessage((payload) => {
      console.log("Message received. ", payload);

      dispatch(
        setNotif({
          title: "New Notification",
          message: payload.notification.body,
        })
      );
    });
  }, [alert, dispatch, user.id]);

  useEffect(() => {
    notifModal &&
      dispatch(
        get(endpointManagement + "/admin/notification", (res) => {
          dispatch(setNotificationData(res.data.data));
          setLoadingNotif(false);
        })
      );
  }, [dispatch, notifModal]);

  useEffect(() => {
    console.log("initializing qiscus...");
    const adminID = role === "sa" ? "admin" : user.management_id;
    const prefix = (role === "sa" ? "centratama" : "management") + "-clink-";
    const userKey = prefix + "key-" + adminID;
    const userID = prefix + adminID;
    const userDisplayName = role === "sa" ? "Centratama Admin" : "Admin";

    Qiscus.init({
      AppId: "fastel-sa-hkxoyooktyv",
      options: {
        newMessagesCallback: (message) => {
          console.log("NEW MESSAGE", message[0].message);
          dispatch(setReloadList());
          message[0].email !== userID &&
            dispatch(
              setNotif({
                title: "New Message",
                message: message[0].username + ": " + message[0].message,
              })
            );
        },
        commentDeliveredCallback: (data) => {
          console.log("DELIVERED CALLBACK", data);
        },
        commentReadCallback: function (data) {
          // On comment has been read by user
          console.log("READ CALLBACK", data);
        },
        loginErrorCallback: function (err) {
          console.log(err);
        },
        loginSuccessCallback: function () {
          // On success
          console.log("Qiscus login: " + Qiscus.isLogin);
          dispatch(setQiscus(Qiscus));
        },
      },
    })
      .then(() => {
        console.log("init success");
        console.log(Qiscus);

        if (!Qiscus.isLogin) {
          //    console.log('run because is login = ', Qiscus.isLogin)
          console.log(
            "setting user to " + userID + " with password " + userKey
          );
          Qiscus.setUser(
            userID,
            userKey,
            userDisplayName,
            "https://avatars.dicebear.com/api/male/" + user.email + ".svg",
            user
          );
        }
      })
      .catch((err) => {
        console.log("Qiscus init failed", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    qiscus &&
      qiscus.getTotalUnreadCount &&
      qiscus
        .getTotalUnreadCount()
        .then(function (unreadCount) {
          // On success
          dispatch(setUnread(unreadCount));
        })
        .catch(function (error) {
          // On error
        });
  }, [dispatch, qiscus, url, messages]);

  useEffect(() => {
    dispatch(
      get(endpointResident + "/banks", (res) => {
        const banks = res.data.data.map((el) => ({
          value: el.bank_name,
          label: el.bank_name,
        }));

        // console.log(banks)

        dispatch(setBanks(banks));
      })
    );
  }, [dispatch]);

  function isSelected(path) {
    return "/" + history.location.pathname.split("/")[2] === path;
  }

  return (
    <>
      {notif.title && (
        <Toast className="Toast">
          <ToastHeader>{notif.title}</ToastHeader>
          <ToastBody>{notif.message}</ToastBody>
        </Toast>
      )}
      <Modal
        isOpen={confirmDelete.modal}
        btnDanger
        toggle={() => dispatch(setConfirmDelete())}
        disableHeader
        okLabel="Confirm"
        onClick={() => {
          dispatch(setConfirmDelete());
          confirmDelete.confirmed();
        }}
        onClickSecondary={() => dispatch(setConfirmDelete())}
      >
        {confirmDelete.content}
      </Modal>
      <Modal
        className="NotificationModal"
        isOpen={notifModal}
        toggle={() => setNotifModal(false)}
        maxHeight={100}
        disableHeader
        disableFooter
      >
        <p className="NotificationModal-title pb-3">Notifications</p>
        <Loading loading={loadingNotif}>
          {items.length === 0 && (
            <div className="NotificationModal-empty">No notifications.</div>
          )}
          <div style={{ height: "1000px", overflow: "scroll" }}>
            {items.length > 0 &&
              items.map((el) => (
                <div
                  class="Container"
                  style={{
                    margin: 0,
                    padding: "14px",
                    display: "flex",
                    cursor: "pointer",
                    maxHeight: "150px",
                    boxShadow: "none",
                    borderRadius: "0",
                    borderBottom: "1px solid #EAF0F5",
                    borderTop: "1px solid #EAF0F5",
                  }}
                  onClick={() => {
                    if (el.topic === "announcement") {
                      history.push(
                        "/" + role + "/announcement/" + el.id + "/view"
                      );
                      setNotifModal(false);
                      return;
                    }
                    history.push("/" + role + "/task/" + el.topic_ref_id);
                    setNotifModal(false);
                  }}
                >
                  {el.image && (
                    <div
                      style={{
                        backgroundColor: "grey",
                        minWidth: el.image ? "140px" : "0px",
                        borderRadius: "4px",
                        marginRight: "15px",
                        color: "white",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={el.image}
                        alt=""
                        style={{
                          position: "absolute",
                          width: "100%",
                          top: "50%",
                          left: "50%",
                          transform: "translateY(-50%) translateX(-50%)",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ textAlign: "left", overflow: "hidden" }}>
                    <b>{el.title}</b>
                    <p style={{ margin: "8px 0px" }}>
                      <span
                        style={{
                          padding: "2px 4px",
                          marginRight: 4,
                          backgroundColor: "lightgrey",
                        }}
                      >
                        {toSentenceCase(el.topic)}
                      </span>
                      {dateTimeFormatter(el.created_on)}
                    </p>
                    <p>{parser(el.description)}</p>
                  </div>
                </div>
              ))}
          </div>
        </Loading>
      </Modal>
      <CustomAlert
        isOpen={alert}
        toggle={() => dispatch(closeAlert())}
        title={title}
        subtitle={subtitle}
        content={content}
      />
      <div className={menuWide ? "TopBar shadow" : "TopBar-wide shadow"}>
        <div className="TopBar-left">
          <div
            className="user-container"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setMenuWide(!menuWide);
              setExpanded("");
            }}
          >
            {role === "sa"
              ? "Superadmin - " + toSentenceCase(user.group)
              : "Building Manager - " + toSentenceCase(user.building_name)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.group !== "vas_advertiser" && user.group !== "vas_sales" && (
              <IconButton onClick={() => history.push("/" + role + "/chat")}>
                <MdChatBubbleOutline />
              </IconButton>
            )}
            {!!unread &&
              user.group !== "vas_advertiser" &&
              user.group !== "vas_sales" && (
                <div className="Badge">{unread}</div>
              )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.group !== "vas_advertiser" && user.group !== "vas_sales" && (
              <IconButton
                onClick={() => {
                  setNotifModal(true);
                  setLoadingNotif(true);
                }}
              >
                <FiBell />
              </IconButton>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user.group !== "vas_advertiser" && user.group !== "vas_sales" && (
              <IconButton
                onClick={() => history.push("/" + role + "/settings")}
              >
                <FiSettings />
              </IconButton>
            )}
          </div>
          <div
            className="ProfileButton"
            onClick={() => {
              setProfile(!profile);
            }}
          >
            {user.firstname + " " + user.lastname}
            <FiChevronDown
              style={{
                marginLeft: 8,
              }}
            />
          </div>
          <div
            className={
              profile ? "ProfileButton-menu" : "ProfileButton-menu-hide"
            }
          >
            <div
              className="ProfileButton-menuItem"
              onClick={() => {
                // qiscus.isLogin && qiscus.disconnect();
                dispatch(logout());
              }}
            >
              <FiLogOut
                style={{
                  marginRight: 8,
                }}
              />
              Logout
            </div>
          </div>
        </div>
      </div>
      <Row
        style={{
          height: "100vh",
        }}
      >
        <div className="Menu shadow">
          <div
            className={menuWide ? "Logo-container" : "Logo-container-small"}
            onClick={() => history.push("/" + role)}
          >
            {menuWide ? (
              <img className="Logo-main" src={clinkLogo} alt="logo" />
            ) : (
              <img
                className="Logo-main-small"
                src={clinkLogoSmall}
                alt="logo"
              />
            )}
          </div>
          <div
            style={{
              height: "auto",
              width: "100%",
            }}
            className={menuWide ? "menu-size" : "menu-size compact"}
            onClick={() => {
              setMenuWide(!menuWide);
              setExpanded("");
            }}
          >
            {menuWide ? (
              <>
                <FiChevronsLeft className="MenuItem-icon" /> <b>Hide Menu</b>
              </>
            ) : (
              <FiChevronsRight className="MenuItem-icon" />
            )}
          </div>
          <div
            style={{
              height: "auto",
              overflowY: "auto",
            }}
          >
            {Children.map(children, (child) => {
              const { icon, group, label, path, subpaths, separator } =
                child.props;

              return label ? (
                <Fragment key={path}>
                  {group ? (
                    <>
                      <div className={menuWide ? "groupItem" : " compact"}>
                        {menuWide ? <>{group}</> : []}
                      </div>
                    </>
                  ) : (
                    []
                  )}
                  <div
                    onClick={
                      expanded === label
                        ? () => setExpanded("")
                        : subpaths
                        ? () => {
                            setExpanded(label);
                            setMenuWide(true);
                          }
                        : () => {
                            history.push(path);
                            console.log(path);
                            // console.log(history.location.pathname);
                            setExpanded("");
                          }
                    }
                    className={
                      (history.location.pathname.split("/")[2] ===
                        path.split("/")[2] ||
                      "/" + history.location.pathname.split("/")[3] === subpaths
                        ? "MenuItem-active"
                        : "MenuItem") + (menuWide ? "" : " compact")
                    }
                  >
                    <div className="MenuItem-icon">{icon}</div>
                    {menuWide && (
                      <div
                        className={
                          menuWide
                            ? history.location.pathname.split("/")[2] ===
                                path.split("/")[2] ||
                              "/" + history.location.pathname.split("/")[3] ===
                                subpaths
                              ? "MenuItem-label-active"
                              : "MenuItem-label"
                            : "MenuItem-label-hidden"
                        }
                      >
                        {label}
                      </div>
                    )}
                    {menuWide && subpaths ? (
                      expanded === label ? (
                        <FiChevronUp
                          style={{
                            marginRight: 16,
                            width: "2rem",
                          }}
                        />
                      ) : (
                        <FiChevronDown
                          style={{
                            marginRight: 16,
                            width: "2rem",
                          }}
                        />
                      )
                    ) : null}
                  </div>
                  {subpaths && (
                    <div
                      className="Submenu"
                      style={
                        menuWide && expanded === label
                          ? {
                              height: subpaths.length * 36 + "px",
                              visibility: "visible",
                            }
                          : {
                              height: 0,
                              visibility: "hidden",
                            }
                      }
                    >
                      {menuWide && expanded === label
                        ? subpaths.map((sub) => (
                            <div
                              key={sub}
                              onClick={() => {
                                history.push(path + sub);
                                // setMenuWide(false);
                              }}
                              className={
                                "/" +
                                  history.location.pathname.split("/")[3] ===
                                sub
                                  ? "SubmenuItem-active"
                                  : "SubmenuItem"
                              }
                            >
                              {toSentenceCase(sub.slice(1))}
                            </div>
                          ))
                        : null}
                    </div>
                  )}
                  {separator ? (
                    <>
                      <div className={menuWide ? "menu-separator" : "compact "}>
                        {/* {menuWide ? <>{separator}</> : []} */}
                      </div>
                    </>
                  ) : (
                    []
                  )}
                </Fragment>
              ) : null;
            })}
          </div>
        </div>
        <div className={menuWide ? "Content" : "Content-wide"}>
          <Info />
          <Switch>
            {children}
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Row>
    </>
  );
}

export default Component;
