import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/slice';
import {
    FiMenu, FiUsers, FiHome, FiBarChart2, FiShoppingCart, FiZap, FiVolume2,
    FiRss, FiTarget, FiBriefcase, FiAward, FiShoppingBag, FiDollarSign, FiLogOut, FiChevronRight, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { Switch, Route, useHistory, Redirect, useLocation } from 'react-router-dom';

import ManagementRoute from './features/management/Route';
import BuildingRoute from './features/building/Route';
import BuildingManagementRoute from './features/building_management/Route';
import ResidentRoute from './features/resident/Route';
import BillingRoute from './features/billing/Route';
import StaffRoute from './features/staff/Route';
import TaskRoute from './features/task/Route';
import MerchantRoute from './features/merchant/Route';
import ProductRoute from './features/product/Route';
import TransactionRoute from './features/transaction/Route';
import AdsRoute from './features/ads/Route';
import AnnouncementRoute from './features/announcement/Route';

import Button from './components/Button';
import Row from './components/Row';
import IconButton from './components/IconButton';
import { toSentenceCase } from './utils';


const menu = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        route: "/dashboard"
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

function Page() {
    const [menuWide, setMenuWide] = useState(true);
    const [expanded, setExpanded] = useState("");
    const [profile, setProfile] = useState(false);

    const { user } = useSelector(state => state.auth);

    let dispatch = useDispatch();
    let history = useHistory();
    let location = useLocation();

    function isSelected(menu) {
        return ('/' + history.location.pathname.split('/')[1]) === menu.route;
    }

    return (
        <div>
            <div className={menuWide ? "TopBar" : "TopBar-wide"}>
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
                    <div className="PageTitle Title">
                        {location.pathname.split('/').map((el, index) =>
                            <Fragment key={el + index}>
                                {index > 1 && <FiChevronRight style={{
                                    paddingLeft: 8,
                                    paddingRight: 8,
                                    paddingTop: 8,
                                }} />}
                                <div
                                    key={el + index}
                                    className="Crumbs"
                                    onClick={() => {
                                        let array = location.pathname.split('/');

                                        if (array[1] === el && array.length > 1) {
                                            history.push('/' + el);
                                        } else if (array[2] === el && array.length > 2) {
                                            history.push('/' + array[1] + '/' + el);
                                        } else if (array[3] === el && array.length > 3) {
                                            history.push('/' + array[1] + '/' + array[2] + '/' + el);
                                        } else {
                                            history.push(el);
                                        }
                                    }}>
                                    {toSentenceCase(el.replace(/-/g, ' '))}
                                </div>
                            </Fragment>
                        )}
                    </div>
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
                <div className="Menu">
                    <div className={menuWide ? "Logo-container" : "Logo-container-small"}>
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
                    <Switch>
                        <Redirect exact from="/" to={"/resident"}
                        />
                        <Route path="/building">
                            <BuildingRoute />
                        </Route>
                        <Route path="/building_management">
                            <BuildingManagementRoute />
                        </Route>
                        <Route path="/management">
                            <ManagementRoute />
                        </Route>
                        <Route path="/resident">
                            <ResidentRoute />
                        </Route>
                        <Route path="/billing">
                            <BillingRoute />
                        </Route>
                        <Route path="/staff">
                            <StaffRoute />
                        </Route>
                        <Route path="/task">
                            <TaskRoute />
                        </Route>
                        <Route path="/merchant">
                            <MerchantRoute />
                        </Route>
                        <Route path="/product">
                            <ProductRoute />
                        </Route>
                        <Route path="/transaction/list">
                            <TransactionRoute />
                        </Route>
                        <Route path="/advertisement">
                            <AdsRoute />
                        </Route>
                        <Route path="/announcement">
                            <AnnouncementRoute />
                        </Route>
                    </Switch>
                </div>
            </Row>
        </div>
    )
}

export default Page;
