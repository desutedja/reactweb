import React, { useEffect, useState } from 'react';
import {
    FiHome, FiUsers, FiZap, FiRss, FiVolume2, FiBarChart2
} from "react-icons/fi";
import { RiStore2Line, RiTaskLine, RiCustomerService2Line } from 'react-icons/ri';
import { Redirect, Route } from 'react-router-dom';

import Template from '../components/Template';
import { useSelector } from 'react-redux';

import Dashboard from './Dashboard';
import Ads from './Ads';
import Announcement from './Announcement';
import Billing from './Billing';
import Building from './Building';
import Merchant from './Merchant';
import Resident from './Resident';
import Staff from './Staff';
import Task from './Task';
import Settings from '../../settings';
import Chat from '../../chat';

const modules = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        path: "/dashboard",
        subpaths: [
            '/building',
            '/task',
            '/advertisement',
        ],
        component: <Dashboard />,
    },
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building",
        path: "/building",
        component: <Building />,
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident",
        path: "/resident",
        component: <Resident />,
    },
    {
        icon: <FiZap className="MenuItem-icon" />,
        label: "Billing",
        path: "/billing",
        subpaths: [
            '/unit',
            '/settlement',
            '/disbursement',
        ],
        component: <Billing />,
    },
    {
        icon: <RiCustomerService2Line className="MenuItem-icon" />,
        label: "Staff",
        path: "/staff",
        component: <Staff />,
    },
    {
        icon: <RiTaskLine className="MenuItem-icon" />,
        label: "Task",
        path: "/task",
        component: <Task />,
    },
    {
        icon: <RiStore2Line className="MenuItem-icon" />,
        label: "Merchant",
        path: "/merchant",
        component: <Merchant />,
    },
    {
        icon: <FiRss className="MenuItem-icon" />,
        label: "Advertisement",
        path: "/advertisement",
        component: <Ads />,
    },
    {
        icon: <FiVolume2 className="MenuItem-icon" />,
        label: "Announcement",
        path: "/announcement",
        component: <Announcement />,
    },
];

function Component() {

    const { blacklist_modules } = useSelector(state => state.auth.user);
    const [menus, setMenus] = useState(modules || [])

    useEffect(() => {
        const modulesLabel = blacklist_modules.map(module => module.module);
        const modulesFilter = menus.filter(menu => {
            const truthy = modulesLabel.some(label => label === menu.label.toLowerCase())
            return !truthy
        })
        setMenus(modulesFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blacklist_modules])

    return (
        <Template role="bm">
            <Redirect exact from={"/bm"} to={"/bm" + menus[0].path} />
            {menus.map(el => <Route
                key={el.label}
                label={el.label}
                icon={el.icon}
                path={"/bm" + el.path}
                subpaths={el.subpaths}
            >
                {el.component}
            </Route>)}
            <Route path={"/bm/chat"}>
                <Chat />
            </Route>
            <Route path={"/bm/settings"}>
                <Settings />
            </Route>
        </Template>
    )
}

export default Component;
