import React from "react";
import {
  FiZap,
} from "react-icons/fi";

import Billing from "./Billing";

import Settings from "../../settings";

import Template from "../components/Template";
import { Route, Redirect } from "react-router-dom";

const menu = [
  // Billing Start
  {
    icon: <FiZap className="MenuItem-icon" />,
    label: "Transaction",
    path: "/transaction",
    subpaths: ["/list"],
    component: <Billing />,
    group: "Transaction",
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
