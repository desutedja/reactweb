import React from "react";
import {
  FiUsers,
  FiBarChart2,
  FiShoppingCart,
  FiZap,
  FiVolume2,
  FiBriefcase,
  FiShoppingBag,
  FiWifi,
  FiFile,
  FiCalendar,
  FiBell,
} from "react-icons/fi";
import {
  RiStore2Line,
  RiTaskLine,
  RiBuilding2Line,
  RiCustomerService2Line,
  RiAdvertisementLine,
  RiCoupon2Line,
  RiBankCardLine,
} from "react-icons/ri";
import { FaIdBadge } from "react-icons/fa";

import Dashboard from "./Dashboard";
import Ads from "./Ads";
import Announcement from "./Announcement";
import Billing from "./Billing";
import Building from "./Building";
import Management from "./Management";
import Vouchers from "./Vouchers";
import PromoVA from "./PromoVA";
import Internet from "./Internet";
import Booking from "./Booking";
import Merchant from "./Merchant";
import Product from "./Product";
import Resident from "./Resident";
import RequestPremium from "./RequestPremium";
import CatatMeter from "./CatatMeter";
import Staff from "./Staff";
import Task from "./Task";
import UserRequest from "./UserRequest";
import Transaction from "./Transaction";
import Admin from "./Admin";
import Xenplatform from "./Xenplatform";
import PushNotif from "./PushNotif";

import Settings from "../../settings";
import Chat from "../../chat";

import Template from "../components/Template";
import { Route, Redirect } from "react-router-dom";

const menu = [
  // Overview Start
  {
    icon: <FiBarChart2 className="MenuItem-icon" />,
    label: "Dashboard",
    path: "/dashboard",
    subpaths: ["/building", "/transaction", "/task", "/advertisement", "/CCTV"],
    component: <Dashboard />,
    group: "Overview",
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
    separator: true,
  },
  // Overview End

  // Building Start
  {
    icon: <FiUsers className="MenuItem-icon" />,
    label: "Resident",
    path: "/resident",
    component: <Resident />,
    group: "Building",
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
    icon: <FiUsers className="MenuItem-icon" />,
    label: "Basic User Request",
    path: "/basicuserrequest",
    component: <RequestPremium />,
    separator: true,
  },
  // Building End

  // Billing Start
  {
    icon: <FiZap className="MenuItem-icon" />,
    label: "Billing",
    path: "/billing",
    subpaths: ["/unit", "/category", "/settlement", "/disbursement"],
    component: <Billing />,
    group: "Billing",
  },
  // {
  //   icon: <RiTaskLine className="MenuItem-icon" />,
  //   label: "XenPlatform",
  //   path: "/xenplatform",
  //   component: <Xenplatform />,
  // },

  {
    icon: <RiTaskLine className="MenuItem-icon" />,
    label: "Catat Meter",
    path: "/catatmeter",
    component: <CatatMeter />,
    separator: true,
  },
  // Billing End

  // Promo Start
  {
    icon: <RiCoupon2Line className="MenuItem-icon" />,
    label: "Vouchers",
    path: "/vouchers",
    component: <Vouchers />,
    group: "Promo",
  },
  {
    icon: <RiBankCardLine className="MenuItem-icon" />,
    label: "Promo VA",
    path: "/promo VA",
    component: <PromoVA />,
    separator: true,
  },
  // Promo End

  // Shop Start
  {
    icon: <RiStore2Line className="MenuItem-icon" />,
    label: "Merchant",
    path: "/merchant",
    component: <Merchant />,
    group: "Shop",
  },
  {
    icon: <FiShoppingBag className="MenuItem-icon" />,
    label: "Product",
    path: "/product",
    component: <Product />,
  },
  {
    icon: <FiShoppingCart className="MenuItem-icon" />,
    label: "Transaction",
    path: "/transaction",
    subpaths: ["/list", "/settlement", "/disbursement"],
    component: <Transaction />,
    separator: true,
  },
  // Shop End

  // Features Start
  {
    icon: <FiWifi className="MenuItem-icon" />,
    label: "Internet",
    path: "/internet",
    component: <Internet />,
    group: "Features",
  },
  {
    icon: <FiCalendar className="MenuItem-icon" />,
    label: "Facility Booking",
    path: "/facility booking",
    component: <Booking />,
  },
  {
    icon: <FiFile className="MenuItem-icon" />,
    label: "User Request",
    path: "/user request",
    component: <UserRequest />,
    separator: true,
  },
  // Featires End

  // Information Start
  {
    icon: <RiAdvertisementLine className="MenuItem-icon" />,
    label: "Advertisement",
    path: "/advertisement",
    component: <Ads />,
    group: "Information",
  },
  {
    icon: <FiVolume2 className="MenuItem-icon" />,
    label: "Announcement",
    path: "/announcement",
    component: <Announcement />,
  },
  {
    icon: <FiBell className="MenuItem-icon" />,
    label: "Push Notification",
    path: "/push notification",
    component: <PushNotif />,
    separator: true,
  },
  // Information End

  // Settings Start
  {
    icon: <FaIdBadge className="MenuItem-icon" />,
    label: "Admin",
    path: "/admin",
    component: <Admin />,
    group: "Settings",
  },
  // Settings End
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
          group={el.group}
          separator={el.separator}
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
