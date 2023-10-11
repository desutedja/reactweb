import React, { useState, Fragment, useEffect, Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { Switch, useHistory, Route } from "react-router-dom";
import { Toast, ToastHeader, ToastBody } from "reactstrap";

import Row from "../../../components/Row";
import NotFound from "../../../components/NotFound";
import CustomAlert from "../../../components/CustomAlert";
import IconButton from "../../../components/IconButton";
import Info from "../../../components/Info";
import Modal from "../../../components/Modal";

import { toSentenceCase } from "../../../utils";
import {
  closeAlert,
  setConfirmDelete,
  setBanks,
  get,
} from "../../slice";
import { logout } from "../../auth/slice";
import {
  endpointResident,
} from "../../../settings";

// const clinkLogo = require("../../../assets/clink_logo.png");
const clinkLogo = require("../../../assets/yipy-logo-color.png");
const clinkLogoSmall = require("../../../assets/yipy-logo-color.png");

function Component({ role, children }) {
  const [menuWide, setMenuWide] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [profile, setProfile] = useState(false);

  const { alert, title, subtitle, content, confirmDelete, notif } = useSelector(
    (state) => state.main
  );

  const { user } = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let history = useHistory();

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
              ? "Superadmin - " + toSentenceCase(user.username)
              : "Building Manager - "}
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
              <IconButton
                onClick={() => history.push("/" + role + "/settings")}
              >
                <FiSettings />
              </IconButton>
          </div>
          <div
            className="ProfileButton"
            onClick={() => {
              setProfile(!profile);
            }}
          >
            {user.username}
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
