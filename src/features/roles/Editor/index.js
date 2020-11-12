import React from "react";
import {
  FiUsers,
  FiBarChart2,
  FiShoppingCart,
  FiZap,
  FiVolume2,
  FiBriefcase,
  FiShoppingBag,
} from "react-icons/fi";
import {
  RiStore2Line,
  RiTaskLine,
  RiBuilding2Line,
  RiCustomerService2Line,
  RiAdvertisementLine,
  RiCoupon2Line,
} from "react-icons/ri";
import { FaIdBadge } from "react-icons/fa";

import Dashboard from "./Dashboard";
import Ads from "./Ads";
import Announcement from "./Announcement";
import Billing from "./Billing";
import Building from "./Building";
import Management from "./Management";
import Vouchers from "./Vouchers";
import Merchant from "./Merchant";
import Product from "./Product";
import Resident from "./Resident";
import Staff from "./Staff";
import Task from "./Task";
import Transaction from "./Transaction";
import Admin from "./Admin";

import Settings from "../../settings";
import Chat from "../../chat";

import Template from "../components/Template";
import { Route, Redirect } from "react-router-dom";

const menu = [
  {
    icon: <FiBarChart2 className="MenuItem-icon" />,
    label: "Dashboard",
    path: "/dashboard",
    subpaths: ["/building", "/transaction", "/task", "/advertisement"],
    component: <Dashboard />,
  },
  {
    icon: <FiBriefcase className="MenuItem-icon" />,
    label: "Management",
    path: "/management",
    component: <Management />,
  },
  {
    icon: <RiBuilding2Line className="MenuItem-icon" />,
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
    subpaths: ["/unit", "/settlement", "/disbursement"],
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
    icon: <FiShoppingBag className="MenuItem-icon" />,
    label: "Product",
    path: "/product",
    component: <Product />,
  },
  {
    icon: <RiCoupon2Line className="MenuItem-icon" />,
    label: "Vouchers",
    path: "/vouchers",
    component: <Vouchers />,
  },
  {
    icon: <FiShoppingCart className="MenuItem-icon" />,
    label: "Transaction",
    path: "/transaction",
    subpaths: ["/list", "/settlement", "/disbursement"],
    component: <Transaction />,
  },
  {
    icon: <RiAdvertisementLine className="MenuItem-icon" />,
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
  {
    icon: <FaIdBadge className="MenuItem-icon" />,
    label: "Admin",
    path: "/admin",
    component: <Admin />,
  },
];

function Component() {
  return (
    <Template role="sa">
      <Redirect exact from={"/sa"} to={"/sa" + menu[0].path} />
      {menu.map((el) => (
        <Route
          key={el.label}
          label={el.label}
          icon={el.icon}
          path={"/sa" + el.path}
          subpaths={el.subpaths}
        >
          {el.component}
        </Route>
      ))}
      <Route path={"/sa/chat/:rf"}>
        <Chat />
      </Route>
      <Route path={"/sa/chat"}>
        <Chat />
      </Route>
      <Route path={"/sa/settings"}>
        <Settings />
      </Route>
    </Template>
  );
}

export default Component;
