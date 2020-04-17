import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/slice';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Row from '../../components/Row';
import { FiMenu, FiUsers, FiHome } from "react-icons/fi";
import { get } from '../../utils';
import { url } from '../../settings';
import { Router, Switch, Route, useHistory } from 'react-router-dom';

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

const columns = [
    { Header: 'id', accessor: 'id' },
    { Header: 'name', accessor: 'name' },
    { Header: 'legal_name', accessor: 'legal_name' },
    { Header: 'owner_name', accessor: 'owner_name' },
    { Header: 'code_name', accessor: 'code_name' },
    { Header: 'phone', accessor: 'phone' },
    { Header: 'email', accessor: 'email' },
    { Header: 'website', accessor: 'website' },
    { Header: 'address', accessor: 'address' },
    { Header: 'district', accessor: 'district' },
    { Header: 'city', accessor: 'city' },
    { Header: 'province', accessor: 'province' },
    { Header: 'zipcode', accessor: 'zipcode' },
    { Header: 'max_units', accessor: 'max_units' },
    { Header: 'max_floors', accessor: 'max_floors' },
    { Header: 'max_sections', accessor: 'max_sections' },
    { Header: 'lat', accessor: 'lat' },
    { Header: 'long', accessor: 'long' },
    { Header: 'logo', accessor: 'logo' },
]

function Page() {
    const [activeMenu, setActiveMenu] = useState(0);
    const [data, setData] = useState([]);

    const token = useSelector(state => state.auth.user.token)

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        get(url + '/building' +
            '?page=' +
            '&limit=' +
            '&search=' +
            '&province=' +
            '&city=' +
            '&district=',
            {
                Authorization: "Bearer " + token
            },
            res => {
                setData(res.data.data.items);
            },
        )
    }, [])

    function changeMenu(index, el) {
        setActiveMenu(index);
        history.push(el.route);
    }

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
                            onClick={() => changeMenu(index, el)}
                            key={el.label}
                            className={index === activeMenu ? "MenuItem-active" : "MenuItem"}>
                            {el.icon}
                            <p className="MenuItem-label">{el.label}</p>
                        </div>
                    )}
                </div>
                <div className="Content">
                    <Switch>
                        <Route exact path="/">
                            <Table columns={columns} data={data} />
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