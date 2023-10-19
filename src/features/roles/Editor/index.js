import React from "react";
import {
  FiZap,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

import Billing from "./Billing";
import User from "./User";
import Dashboard from "./Dashboard";

import Settings from "../../settings";

import Template from "../components/Template";
import { Route, Redirect } from "react-router-dom";

const menu = [
  {
    icon: <FiZap className="MenuItem-icon" />,
    label: "Transaction",
    path: "/transaction",
    subpaths: ["/list","/bonus"],
    component: <Billing />,
    group: "Transaction",
  },
  {
    icon: <FiBarChart2 className="MenuItem-icon" />,
    label: "Dashboard",
    path: "/dashboard",
    subpaths: ["/advertisement"],
    // subpaths: ["/building", "/transaction", "/task", "/advertisement"],
    component: <Dashboard />,
    group: "Overview",
  },
  {
    icon: <FiUsers className="MenuItem-icon" />,
    label: "User",
    path: "/user",
    component: <User />,
    group: "User",
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
          group={el.group}
          separator={el.separator}
        >
          {el.component}
        </Route>
      ))}
      <Route path={"/sa/settings"}>
        <Settings />
      </Route>
    </Template>
  );
  
}

export default Component;
