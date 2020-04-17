import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../auth/slice';
import Button from '../../components/Button';
import Row from '../../components/layout/Row';
import { FiMenu, FiUsers, FiHome } from "react-icons/fi";

const menu = [
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building"
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident"
    },
]

function Page() {
    let dispatch = useDispatch();

    return (
        <div>
            <div className="TopBar">
                <FiMenu className="MenuToggle" />
                <Button onClick={() => dispatch(logout())} label="Logout" />
            </div>
            <Row>
                <div className="Menu">
                    {menu.map(el =>
                        <div key={el.label} className="MenuItem">
                            {el.icon}
                            <p className="MenuItem-label">{el.label}</p>
                        </div>
                    )}
                </div>
                <div className="Content"></div>
            </Row>
        </div>
    )
}

export default Page;