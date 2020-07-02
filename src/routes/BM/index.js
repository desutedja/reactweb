import React, {  } from 'react';
import {
    FiBriefcase, FiBarChart2, FiHome
} from "react-icons/fi";

import Template from '../components/Template';

import Dashboard from '../../features/dashboard/Route';
import Ads from '../../features/routes/Ads';
import Announcement from '../../features/routes/Announcement';
import Billing from '../../features/routes/Billing';
import Building from '../../features/routes/Building';
import Management from '../../features/routes/Management';
import Merchant from '../../features/routes/Merchant';
import Product from '../../features/routes/Product';
import Resident from '../../features/routes/Resident';
import Staff from '../../features/routes/Staff';
import Task from '../../features/routes/Task';
import Transaction from '../../features/routes/Transaction';

const menu = [
    {
        icon: <FiBriefcase className="MenuItem-icon" />,
        label: "Management",
        route: "/management",
        component: <Management />,
    },
    {
        icon: <FiHome className="MenuItem-icon" />,
        label: "Building",
        route: "/building",
        component: <Building />,
    },
]

function Component() {
    return (
        <Template role="bm" menu={menu} />
    )
}

export default Component;
