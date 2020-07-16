import React, { useEffect, useState } from 'react';
import {
    FiHome, FiUsers, FiZap, FiAward, FiTarget, FiRss, FiVolume2
} from "react-icons/fi";

import Template from '../components/Template';
import { useSelector } from 'react-redux';

import Ads from '../../features/routes/Ads';
import Announcement from '../../features/routes/Announcement';
import Billing from '../../features/routes/Billing';
import Building from '../../features/routes/Building';
import Resident from '../../features/routes/Resident';
import Staff from '../../features/routes/Staff';
import Task from '../../features/routes/Task';
// eslint-disable-next-line no-unused-vars
import { MdSettingsInputSvideo } from 'react-icons/md';

const modules = [
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
        icon: <FiAward className="MenuItem-icon" />,
        label: "Staff",
        route: "/staff",
        component: <Staff />,
    },
    {
        icon: <FiTarget className="MenuItem-icon" />,
        label: "Task",
        route: "/task",
        component: <Task />,
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

    const { auth } = useSelector(state => state);
    // eslint-disable-next-line no-unused-vars
    const [menus, setMenus] = useState(modules || [])

    useEffect(() => {
        if (auth.role === 'bm') {
            const modulesLabel = auth.user.blacklist_modules.map(module => module.module);
            const modulesFilter = menus.filter(menu => modulesLabel.some(module => menu.label.toLowerCase() !== module))
            
            console.log(modulesFilter)
            // auth.user.blacklist_modules.length > 0 &&
            // setMenus()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth])

    return (
        <Template role="bm" menu={menus} />
    )
}

export default Component;
