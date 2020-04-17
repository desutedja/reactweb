import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './features/auth/slice';
import { FiMenu, FiUsers, FiHome } from "react-icons/fi";
import { Switch, Route, useHistory } from 'react-router-dom';

import BuildingList from './features/building/List';

import Button from './components/Button';
import Row from './components/Row';


const menu = [
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building",
        route: "/"
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident",
        route: "/resident"
    },
]

function Page() {
    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <div className="TopBar">
                <FiMenu className="MenuToggle" />
                <Button onClick={() => dispatch(logout())} label="Logout" />
            </div>
            <Row>
                <div className="Menu">
                    {menu.map((el, index) =>
                        <div
                            onClick={() => history.push(el.route)}
                            key={el.label}
                            className={history.location.pathname === el.route ? "MenuItem-active" : "MenuItem"}>
                            {el.icon}
                            <p className="MenuItem-label">{el.label}</p>
                        </div>
                    )}
                </div>
                <div className="Content">
                    <Switch>
                        <Route exact path="/">
                            <BuildingList />
                        </Route>
                        <Route path="/resident">

                        </Route>
                    </Switch>
                </div>
            </Row>
        </div>
    )
}

export default Page;