import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './features/auth/slice';
import { FiMenu, FiUsers, FiHome, FiBarChart2, FiDollarSign, FiShoppingCart, FiZap, FiVolume2, FiRss, FiTarget, FiBriefcase, FiAward } from "react-icons/fi";
import { Switch, Route, useHistory, Redirect, useLocation } from 'react-router-dom';

import ManagementRoute from './features/management/Route';
import BuildingRoute from './features/building/Route';
import ResidentRoute from './features/resident/Route';
import StaffRoute from './features/staff/Route';
import TaskRoute from './features/task/Route';
import AdsRoute from './features/ads/Route';

import Button from './components/Button';
import Row from './components/Row';
import IconButton from './components/IconButton';


const menu = [
    // {
    //     icon: <FiBarChart2 className="MenuItem-icon" />,
    //     label: "Dashboard",
    //     route: "/dashboard"
    // },
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
        icon: <FiAward className="MenuItem-icon" />,
        label: "Staff",
        route: "/staff"
    },
    {
        icon: <FiTarget className="MenuItem-icon" />,
        label: "Task",
        route: "/task"
    },
    // {
    //     icon: <FiZap className="MenuItem-icon" />,
    //     label: "Billing",
    //     route: "/billing"
    // },
    // {
    //     icon: <FiShoppingCart className="MenuItem-icon" />,
    //     label: "Merchant",
    //     route: "/merchant"
    // },
    // {
    //     icon: <FiDollarSign className="MenuItem-icon" />,
    //     label: "Settlement",
    //     route: "/settlement"
    // },
    {
        icon: <FiRss className="MenuItem-icon" />,
        label: "Advertisement",
        route: "/advertisement"
    },
    // {
    //     icon: <FiVolume2 className="MenuItem-icon" />,
    //     label: "Announcement",
    //     route: "/announcement"
    // },
]

function Page() {
    const [menuWide, setMenuWide] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();
    let location = useLocation();

    return (
        <div>
            <div className="TopBar">
                <div className="TopBar-left">
                    <IconButton
                        className="MenuToggle"
                        onClick={() => setMenuWide(!menuWide)}
                    >
                        <FiMenu />
                    </IconButton>
                    <div className="PageTitle Title">
                        {location.pathname}
                    </div>
                </div>
                <Button onClick={() => dispatch(logout())} label="Logout" />
            </div>
            <Row>
                <div className={menuWide ? "Menu" : "Menu-compact"}>
                    {menu.map((el, index) =>
                        <div
                            onClick={() => history.push(el.route)}
                            key={el.label}
                            className={history.location.pathname === el.route ? "MenuItem-active" : "MenuItem"}>
                            {el.icon}
                            {menuWide && <p className="MenuItem-label">{el.label}</p>}
                        </div>
                    )}
                </div>
                <div className={menuWide ? "Content" : "Content-wide"}>
                    <Switch>
                        <Redirect exact from="/" to={"/management"}
                        />
                        <Route path="/management">
                            <ManagementRoute />
                        </Route>
                        <Route path="/building">
                            <BuildingRoute />
                        </Route>
                        <Route path="/resident">
                            <ResidentRoute />
                        </Route>
                        <Route path="/staff">
                            <StaffRoute />
                        </Route>
                        <Route path="/task">
                            <TaskRoute />
                        </Route>
                        <Route path="/advertisement">
                            <AdsRoute />
                        </Route>
                    </Switch>
                </div>
            </Row>
        </div>
    )
}

export default Page;