import React from "react";
import { FiBarChart2 } from "react-icons/fi";
import { RiAdvertisementLine } from "react-icons/ri";

import Dashboard from "./Dashboard";
import Ads from "./Ads";

import Settings from "../../settings";

import Template from "../components/Template";
import { Route, Redirect } from "react-router-dom";

const menu = [
  {
    icon: <FiBarChart2 className="MenuItem-icon" />,
    label: "Dashboard",
    path: "/dashboard",
    subpaths: ["/advertisement"],
    component: <Dashboard />,
  },
  {
    icon: <RiAdvertisementLine className="MenuItem-icon" />,
    label: "Advertisement",
    path: "/advertisement",
    component: <Ads />,
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
      {/* <Route path={"/sa/chat"}>
                <Chat />
            </Route> */}
      {/* <Route path={"/sa/settings"}>
        <Settings />
      </Route> */}
    </Template>
  );
}

export default Component;
