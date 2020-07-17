import React, { useEffect, useState } from 'react';
import {
    FiHome, FiUsers, FiZap, FiRss, FiVolume2, FiBarChart2
} from "react-icons/fi";
import { RiStore2Line, RiTaskLine, RiCustomerService2Line } from 'react-icons/ri';

import Template from '../components/Template';
import { useSelector } from 'react-redux';

import Dashboard from '../../features/dashboard/Route';
import Ads from '../../features/routes/Ads';
import Announcement from '../../features/routes/Announcement';
import Billing from '../../features/routes/Billing';
import Building from '../../features/routes/Building';
import Resident from '../../features/routes/Resident';
import Staff from '../../features/routes/Staff';
import Task from '../../features/routes/Task';
import Merchant from '../../features/routes/Merchant';

// eslint-disable-next-line no-unused-vars
import { MdSettingsInputSvideo } from 'react-icons/md';

const modules = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        route: "/dashboard",
        subroutes: [
            '/building',
            '/transaction',
            '/task',
            '/advertisement',
        ],
        component: <Dashboard />,
    },
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building",
        route: "/building",
        component: <Building />,
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident",
        route: "/resident",
        component: <Resident />,
    },
    {
        icon: <FiZap className="MenuItem-icon" />,
        label: "Billing",
        route: "/billing",
        subroutes: [
            '/unit',
            '/settlement',
            '/disbursement',
        ],
        component: <Billing />,
    },
    {
        icon: <RiCustomerService2Line className="MenuItem-icon" />,
        label: "Staff",
        route: "/staff",
        component: <Staff />,
    },
    {
        icon: <RiTaskLine className="MenuItem-icon" />,
        label: "Task",
        route: "/task",
        component: <Task />,
    },
    {
        icon: <RiStore2Line className="MenuItem-icon" />,
        label: "Merchant",
        route: "/merchant",
        component: <Merchant />,
    },
    {
        icon: <FiRss className="MenuItem-icon" />,
        label: "Advertisement",
        route: "/advertisement",
        component: <Ads />,
    },
    {
        icon: <FiVolume2 className="MenuItem-icon" />,
        label: "Announcement",
        route: "/announcement",
        component: <Announcement />,
    },
];

function Component() {

    const { blacklist_modules } = useSelector(state => state.auth.user);
    // eslint-disable-next-line no-unused-vars
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
        <Template role="bm" menu={menus} />
    )
}

export default Component;
