import React, { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/slice';
import {
    FiMenu, FiLogOut, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { MdChatBubble, MdNotifications, MdSettings } from "react-icons/md";
import { Switch, Route, useHistory, Redirect, useRouteMatch } from 'react-router-dom';
import QiscusSDKCore from 'qiscus-sdk-core';

import Row from '../../components/Row';
import CustomAlert from '../../components/CustomAlert';
import IconButton from '../../components/IconButton';
import Info from '../../components/Info';
import Modal from '../../components/Modal';
import Chat from '../../features/chat/Route';

import { toSentenceCase } from '../../utils';
import { closeAlert, setConfirmDelete, setNotif } from '../../features/slice';
import { setQiscus, updateMessages, setUnread } from '../../features/chat/slice';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';
import Axios from 'axios';
import Settings from '../../features/settings';

const Qiscus = new QiscusSDKCore();

const clinkLogo = require("../../assets/clink_logo.png");
const clinkLogoSmall = require("../../assets/clink_logo_small.png");

function Component({ role, menu }) {
    const [menuWide, setMenuWide] = useState(false);
    const [expanded, setExpanded] = useState("");
    const [profile, setProfile] = useState(false);
    const [notifModal, setNotifModal] = useState(false);

    const { alert, title, content, confirmDelete, notif } = useSelector(state => state.main);
    const { user } = useSelector(state => state.auth);
    const { qiscus, unread, messages } = useSelector(state => state.chat);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        const userID = "centratama-clink-" + user.id;

        Qiscus.init({
            AppId: 'fastel-sa-hkxoyooktyv',
            options: {
                newMessagesCallback: message => {
                    console.log('received', message);
                    dispatch(updateMessages(message));
                    dispatch(setNotif({
                        title: "New Message",
                        message: message[0].username + ': ' + message[0].message,
                    }))
                },
                commentReadCallback: function (data) {
                    // On comment has been read by user
                    console.log('read', data)
                },
            },
        }).then(() => {
            console.log('init success');

            !Qiscus.isLogin &&
                Qiscus.setUser(userID, 'kucing', user.firstname + ' ' + user.lastname,
                    'https://avatars.dicebear.com/api/male/' + user.email + '.svg', user)
                    .then(function () {
                        // On success
                        console.log('Qiscus login: ' + Qiscus.isLogin);

                        dispatch(setQiscus(Qiscus));

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
                    })
        }).catch(err => console.log(err))
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

    function isSelected(menu) {
        return ('/' + history.location.pathname.split('/')[2]) === menu.route;
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
            <CustomAlert isOpen={alert} toggle={() => dispatch(closeAlert())} title={title}
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
                    {menu.map(el =>
                        <Fragment
                            key={el.label}
                        >
                            <div
                                onClick={expanded === el.label ? () => setExpanded("")
                                    : el.subroutes ? () => {
                                        setExpanded(el.label);
                                        setMenuWide(true);
                                    } :
                                        () => {
                                            history.push(path + el.route);
                                            setExpanded("");
                                        }}
                                className={(isSelected(el) ? "MenuItem-active" : "MenuItem") +
                                    (menuWide ? "" : " compact")}>
                                <div className="MenuItem-icon">{el.icon}</div>
                                {menuWide && <div className={menuWide ? "MenuItem-label" : "MenuItem-label-hidden"}>
                                    {el.label}
                                </div>}
                                {menuWide && el.subroutes ? expanded === el.label ?
                                    <FiChevronUp style={{
                                        marginRight: 16,
                                        width: '2rem'
                                    }} /> : <FiChevronDown style={{
                                        marginRight: 16,
                                        width: '2rem'
                                    }} /> : null}
                            </div>
                            {menuWide && expanded === el.label && <div className="Submenu">
                                {el.subroutes.map(sub => <div
                                    key={sub}
                                    onClick={() => history.push(path + el.route + sub)}
                                    className={('/' + history.location.pathname.split('/')[3]) === sub
                                        ? "SubmenuItem-active" : "SubmenuItem"}
                                >
                                    {toSentenceCase(sub.slice(1))}
                                </div>)}
                            </div>}
                        </Fragment>
                    )}
                </div>
                <div className={(menuWide ? "Content" : "Content-wide")}>
                    <Info />
                    <Switch>
                        <Redirect exact from={"/" + role} to={"/" + role + menu[0].route} />
                        {menu.map(el => <Route key={el.label} path={"/" + role + el.route}>
                            {el.component}
                        </Route>)}
                        <Route path={"/" + role + "/chat"}>
                            <Chat />
                        </Route>
                        <Route path={"/" + role + "/settings"}>
                            <Settings />
                        </Route>
                    </Switch>
                </div>
            </Row>
        </>
    )
}

export default Component;
