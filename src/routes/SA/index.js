import React, {  } from 'react';
import { 
    FiUsers,
    // FiHome,
    FiBarChart2,
    FiShoppingCart,
    FiZap,
    FiVolume2,
    FiRss,
    // FiTarget,
    FiBriefcase,
    // FiAward,
    FiShoppingBag,
    // FiDollarSign
} from "react-icons/fi";
import {
    RiStore2Line, RiTaskLine,
    // RiAdvertisementLine,
    RiBuilding2Line, RiCustomerService2Line,
} from "react-icons/ri";

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
import Admin from '../../features/admin';

import Template from '../components/Template';
import { FaIdBadge } from 'react-icons/fa';

const menu = [
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
        icon: <FiBriefcase className="MenuItem-icon" />,
        label: "Management",
        route: "/management",
        component: <Management />,
    },
    {
        icon: <RiBuilding2Line className="MenuItem-icon" />,
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
        icon: <FiShoppingBag className="MenuItem-icon" />,
        label: "Product",
        route: "/product",
        component: <Product />,
    },
    {
        icon: <FiShoppingCart className="MenuItem-icon" />,
        label: "Transaction",
        route: "/transaction",
        subroutes: [
            '/list',
            '/settlement',
            '/disbursement',
        ],
        component: <Transaction />,
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
    {
        icon: <FaIdBadge className="MenuItem-icon" />,
        label: "Admin",
        route: "/admin",
        component: <Admin />,
    },
]

function Component() {
    return (
        <Template role="sa" menu={menu} />
    )
}

export default Component;
