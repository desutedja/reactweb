import React, { useState, Fragment, useEffect, Children } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiMenu, FiLogOut, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { MdChatBubble, MdNotifications, MdSettings } from "react-icons/md";
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import QiscusSDKCore from 'qiscus-sdk-core';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import Row from '../../../components/Row';
import CustomAlert from '../../../components/CustomAlert';
import IconButton from '../../../components/IconButton';
import Info from '../../../components/Info';
import Modal from '../../../components/Modal';

import { toSentenceCase } from '../../../utils';
import { closeAlert, setConfirmDelete, setNotif, setBanks, get } from '../../slice';
import { setQiscus, setUnread, setReloadList } from '../../chat/slice';
import { logout } from '../../auth/slice';
import { endpointResident } from '../../../settings';

const Qiscus = new QiscusSDKCore();

const clinkLogo = require("../../../assets/clink_logo.png");
const clinkLogoSmall = require("../../../assets/clink_logo_small.png");

function Component({ role, children }) {
    const [menuWide, setMenuWide] = useState(false);
    const [expanded, setExpanded] = useState("");
    const [profile, setProfile] = useState(false);
    const [notifModal, setNotifModal] = useState(false);

    const { alert, title, subtitle, content, confirmDelete, notif } = useSelector(state => state.main);
    const { user } = useSelector(state => state.auth);
    const { qiscus, unread, messages } = useSelector(state => state.chat);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        console.log("initializing qiscus...")
        const adminID = role === "sa" ? user.id : user.building_management_id;
        const prefix = (role === "sa" ? "centratama" : "management") + "-clink-";
        const userKey = prefix + "key-" + adminID;
        const userID = prefix + adminID;
        const userDisplayName = role === "sa" ? "Centratama Admin" : "Admin";

        Qiscus.init({ AppId: 'fastel-sa-hkxoyooktyv',
            options: {
                newMessagesCallback: message => {
                    console.log('received', message);
                    dispatch(setReloadList(true));
                    dispatch(setNotif({
                        title: "New Message",
                        message: message[0].username + ': ' + message[0].message,
                    }))
                },
                commentReadCallback: function (data) {
                    // On comment has been read by user
                    console.log('read', data)
                },
                loginErrorCallback: function (err) {
                    console.log(err);
                },
                loginSuccessCallback: function () {
                    // On success
                    console.log('Qiscus login: ' + Qiscus.isLogin);
                    dispatch(setQiscus(Qiscus));

                    /*
                    Axios.post('https://api.qiscus.com/api/v2.1/rest/add_room_participants', {
                        "room_id": "19278255",
                        "user_ids": [userID],
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            "QISCUS-SDK-APP-ID": "fastel-sa-hkxoyooktyv",
                            "QISCUS-SDK-SECRET": "20b6212e9782708f9260032856be6fcb",
                        }
                    })
                        .then(res => console.log('RESULT Qiscuss: ', res))
                        .catch(err => console.log('ERROR Qiscuss: ', err))
                   */
                },
            },
        }).then(() => {
            console.log('init success');
            console.log(Qiscus);

            if (!Qiscus.isLogin) {
                //    console.log('run because is login = ', Qiscus.isLogin) 
                console.log("setting user to " + userID + " with password " + userKey)
                Qiscus.setUser(userID, userKey, userDisplayName,
                    'https://avatars.dicebear.com/api/male/' + user.email + '.svg', user)
            }
        }).catch(err => {
            console.log("Qiscus init failed");
            console.log(err)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        qiscus && qiscus.getTotalUnreadCount && qiscus.getTotalUnreadCount()
            .then(function (unreadCount) {
                // On success
                dispatch(setUnread(unreadCount));
            })
            .catch(function (error) {
                // On error
            })
    }, [dispatch, qiscus, url, messages]);

    useEffect(() => {
        dispatch(get(endpointResident + '/banks', res => {
            const banks = res.data.data.map(el => ({
                value: el.bank_name,
                label: el.bank_name,
            }))

            // console.log(banks)

            dispatch(setBanks(banks))
        }))
    }, [dispatch])

    function isSelected(path) {
        return ('/' + history.location.pathname.split('/')[2]) === path;
    }

    return (
        <>
            {notif.title && <Toast className="Toast">
                <ToastHeader>
                    {notif.title}
                </ToastHeader>
                <ToastBody>
                    {notif.message}
                </ToastBody>
            </Toast>}
            <Modal
                isOpen={confirmDelete.modal}
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
                disableHeader
                disableFooter
            >
                <p className="NotificationModal-title">Notifications</p>
                <div className="NotificationModal-empty">No notifications.</div>
            </Modal>
            <CustomAlert isOpen={alert} toggle={() => dispatch(closeAlert())} title={title} subtitle={subtitle}
                content={content}
            />
            <div className={menuWide ? "TopBar shadow" : "TopBar-wide shadow"}>
                <div className="TopBar-left">
                    <IconButton
                        className="MenuToggle"
                        onClick={() => {
                            setMenuWide(!menuWide);
                            setExpanded("");
                        }}
                    >
                        <FiMenu style={{
                            marginRight: 16,
                        }} />
                        {role === 'sa' ? 'Superadmin' : 'Building Manager'}
                    </IconButton>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <IconButton
                            onClick={() => history.push('/' + role + '/chat')}
                        >
                            <MdChatBubble />
                        </IconButton>
                        {!!unread && <div className="Badge">
                            {unread}
                        </div>}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <IconButton
                            onClick={() => setNotifModal(true)}
                        >
                            <MdNotifications />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <IconButton
                            onClick={() => history.push('/' + role + '/settings')}
                        >
                            <MdSettings />
                        </IconButton>
                    </div>
                    <div className="ProfileButton" onClick={() => {
                        setProfile(!profile)
                    }}>
                        {user.firstname + ' ' + user.lastname}
                        <FiChevronDown style={{
                            marginLeft: 8,
                        }} />
                    </div>
                    <div className={profile ? "ProfileButton-menu" : "ProfileButton-menu-hide"}>
                        <div className="ProfileButton-menuItem" onClick={() => {
                            // qiscus.isLogin && qiscus.disconnect();
                            dispatch(logout());
                        }}>
                            <FiLogOut style={{
                                marginRight: 8
                            }} />
                        Logout
                    </div>
                    </div>
                </div>
            </div>
            <Row style={{
                height: '100vh'
            }}>
                <div className="Menu shadow scroller-y">
                    <div className={menuWide ? "Logo-container" : "Logo-container-small"}
                        onClick={() => history.push('/' + role)}
                    >
                        {menuWide ? <img className="Logo-main"
                            src={clinkLogo} alt="logo" />
                            : <img className="Logo-main-small"
                                src={clinkLogoSmall} alt="logo" />}
                    </div>
                    {Children.map(children, child => {
                        const { icon, label, path, subpaths } = child.props;

                        return label ? (
                            <Fragment
                                key={path}
                            >
                                <div
                                    onClick={expanded === label ? () => setExpanded("")
                                        : subpaths ? () => {
                                            setExpanded(label);
                                            setMenuWide(true);
                                        } :
                                            () => {
                                                history.push(path);
                                                setExpanded("");
                                            }}
                                    className={(isSelected(path) ? "MenuItem-active" : "MenuItem") +
                                        (menuWide ? "" : " compact")}
                                >
                                    <div className="MenuItem-icon">{icon}</div>
                                    {menuWide && <div className={menuWide ? "MenuItem-label" : "MenuItem-label-hidden"}>
                                        {label}
                                    </div>}
                                    {menuWide && subpaths ? expanded === label ?
                                        <FiChevronUp style={{
                                            marginRight: 16,
                                            width: '2rem'
                                        }} /> : <FiChevronDown style={{
                                            marginRight: 16,
                                            width: '2rem'
                                        }} /> : null}
                                </div>
                                {menuWide && expanded === label && <div className="Submenu">
                                    {subpaths.map(sub => <div
                                        key={sub}
                                        onClick={() => {
                                            history.push(path + sub);
                                            setMenuWide(false);
                                        }}
                                        className={('/' + history.location.pathname.split('/')[3]) === sub
                                            ? "SubmenuItem-active" : "SubmenuItem"}
                                    >
                                        {toSentenceCase(sub.slice(1))}
                                    </div>)}
                                </div>}
                            </Fragment>
                        ) : null
                    })}
                </div>
                <div className={(menuWide ? "Content" : "Content-wide")}>
                    <Info />
                    <Switch>
                        {children}
                    </Switch>
                </div>
            </Row>
        </>
    )
}

export default Component;
