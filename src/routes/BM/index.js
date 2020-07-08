import React, {  } from 'react';
import {
    // FiBriefcase,
    // FiBarChart2,
    FiHome, FiUsers, FiZap, FiAward, FiTarget, FiRss, FiVolume2
} from "react-icons/fi";

import Template from '../components/Template';

// import Dashboard from '../../features/dashboard/Route';
import Ads from '../../features/routes/Ads';
import Announcement from '../../features/routes/Announcement';
import Billing from '../../features/routes/Billing';
import Building from '../../features/routes/Building';
// import Management from '../../features/routes/Management';
// import Merchant from '../../features/routes/Merchant';
// import Product from '../../features/routes/Product';
import Resident from '../../features/routes/Resident';
import Staff from '../../features/routes/Staff';
import Task from '../../features/routes/Task';
// import Transaction from '../../features/routes/Transaction';

const menu = [
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
]

function Component() {
    return (
        <Template role="bm" menu={menu} />
    )
}

export default Component;
