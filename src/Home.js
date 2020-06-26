import React, { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/slice';
import {
    FiMenu, FiUsers, FiHome, FiBarChart2, FiShoppingCart, FiZap, FiVolume2,
    FiRss, FiTarget, FiBriefcase, FiAward, FiShoppingBag, FiDollarSign, FiLogOut, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import QiscusSDKCore from 'qiscus-sdk-core';

import DashboardRoute from './features/dashboard/Route';
import ChatRoute from './features/chat/Route';

import Ads from './features/routes/Ads';
import Announcement from './features/routes/Announcement';
import Billing from './features/routes/Billing';
import Building from './features/routes/Building';
import Management from './features/routes/Management';
import Merchant from './features/routes/Merchant';
import Product from './features/routes/Product';
import Resident from './features/routes/Resident';
import Staff from './features/routes/Staff';
import Task from './features/routes/Task';
import Transaction from './features/routes/Transaction';

import Row from './components/Row';
import CustomAlert from './components/CustomAlert';
import IconButton from './components/IconButton';
import Info from './components/Info';
import Modal from './components/Modal';

import { toSentenceCase } from './utils';
import { closeAlert, setConfirmDelete } from './features/slice';
import { setQiscus, updateMessages } from './features/chat/slice';

const qiscus = new QiscusSDKCore();

const menu = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        route: "/dashboard",
        subroutes: [
            '/billing',
            '/transaction',
            '/task',
            '/advertisement',
        ]
    },
    {
        icon: <FiBriefcase className="MenuItem-icon" />,
        label: "Management",
        route: "/management"
    },
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building",
        route: "/building"
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident",
        route: "/resident"
    },
    {
        icon: <FiZap className="MenuItem-icon" />,
        label: "Billing",
        route: "/billing",
        subroutes: [
            '/unit',
            '/settlement',
            '/disbursement',
        ]
    },
    {
        icon: <FiAward className="MenuItem-icon" />,
        label: "Staff",
        route: "/staff"
    },
    {
        icon: <FiTarget className="MenuItem-icon" />,
        label: "Task",
        route: "/task"
    },
    {
        icon: <FiShoppingCart className="MenuItem-icon" />,
        label: "Merchant",
        route: "/merchant"
    },
    {
        icon: <FiShoppingBag className="MenuItem-icon" />,
        label: "Product",
        route: "/product"
    },
    {
        icon: <FiDollarSign className="MenuItem-icon" />,
        label: "Transaction",
        route: "/transaction",
        subroutes: [
            '/list',
            '/settlement',
            '/disbursement',
        ]
    },
    {
        icon: <FiRss className="MenuItem-icon" />,
        label: "Advertisement",
        route: "/advertisement"
    },
    {
        icon: <FiVolume2 className="MenuItem-icon" />,
        label: "Announcement",
        route: "/announcement"
    },
]

function Component() {
    const [menuWide, setMenuWide] = useState(false);
    const [expanded, setExpanded] = useState("");
    const [profile, setProfile] = useState(false);

    const { alert, title, content, confirmDelete } = useSelector(state => state.main);
    const { user } = useSelector(state => state.auth);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        const userID = "superadmin" + user.id + user.email;

        qiscus.init({
            AppId: 'fastelsar-tvx6nj235zm',
            options: {
                newMessagesCallback: message => dispatch(updateMessages(message)),
            },
        }).then(() => {
            console.log('init success');

            !qiscus.isLogin && qiscus.setUser(userID, 'kucing', user.firstname + ' ' + user.lastname,
                'https://avatars.dicebear.com/api/male/' + user.email + '.svg', user)
                .then(function (authData) {
                    // On success
                    console.log(authData);
                    console.log(qiscus.isLogin);

                    dispatch(setQiscus(qiscus));
                })
                .catch(function (error) {
                    // On error
                    alert('setUser: ' + error);
                })
        }).catch(error => {
            alert('init: ' + error);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    function isSelected(menu) {
        return ('/' + history.location.pathname.split('/')[1]) === menu.route;
    }

    return (
        <div>
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
                        <FiMenu />
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
                        qiscus.isLogin && qiscus.disconnect();
                        dispatch(logout());
                    }}>
                        <FiLogOut style={{
                            marginRight: 8
                        }} />
                        Logout
                    </div>
                </div>
            </div>
            <Row>
                <div className="Menu shadow">
                    <div className={menuWide ? "Logo-container" : "Logo-container-small"}
                        onClick={() => history.push('/')}
                    >
                        {menuWide ? <img className="Logo-main"
                            src={require("./assets/clink_logo.png")} alt="logo" />
                            : <img className="Logo-main-small"
                                src={require("./assets/clink_logo_small.png")} alt="logo" />}
                    </div>
                    {menu.map((el, index) =>
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
                                            history.push(el.route);
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
                                    onClick={() => history.push(el.route + sub)}
                                    className={('/' + history.location.pathname.split('/')[2]) === sub
                                        ? "SubmenuItem-active" : "SubmenuItem"}
                                >
                                    {toSentenceCase(sub.slice(1))}
                                </div>)}
                            </div>}
                        </Fragment>
                    )}
                </div>
                <div className={menuWide ? "Content" : "Content-wide"}>
                    <Info />
                    <Switch>
                        <Redirect exact from="/" to={"/dashboard/task"} />
                        <Route path="/dashboard">
                            <DashboardRoute />
                        </Route>
                        <Route path="/building">
                            <Building />
                        </Route>
                        <Route path="/management">
                            <Management />
                        </Route>
                        <Route path="/resident">
                            <Resident />
                        </Route>
                        <Route path="/billing">
                            <Billing />
                        </Route>
                        <Route path="/staff">
                            <Staff />
                        </Route>
                        <Route path="/task">
                            <Task />
                        </Route>
                        <Route path="/merchant">
                            <Merchant />
                        </Route>
                        <Route path="/product">
                            <Product />
                        </Route>
                        <Route path="/transaction">
                            <Transaction />
                        </Route>
                        <Route path="/advertisement">
                            <Ads />
                        </Route>
                        <Route path="/announcement">
                            <Announcement />
                        </Route>
                        <Route path="/chat">
                            <ChatRoute />
                        </Route>
                    </Switch>
                </div>
            </Row>
        </div>
    )
}

export default Component;
