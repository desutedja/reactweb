import React, { } from 'react';
import {
    FiShoppingCart,
    FiZap,
} from "react-icons/fi";

import Billing from './Billing';
import Transaction from './Transaction';

import Settings from '../../settings';
import Chat from '../../chat';

import Template from '../components/Template';
import { Route, Redirect } from 'react-router-dom';

const menu = [
    {
        icon: <FiZap className="MenuItem-icon" />,
        label: "Billing",
        path: "/billing",
        subpaths: [
            '/settlement',
            '/disbursement',
        ],
        component: <Billing />,
    },
    {
        icon: <FiShoppingCart className="MenuItem-icon" />,
        label: "Transaction",
        path: "/transaction",
        subpaths: [
            '/list',
            '/settlement',
            '/disbursement',
        ],
        component: <Transaction />,
    },
]

function Component() {
    return (
        <Template role="sa">
            <Redirect exact from={"/sa"} to={"/sa" + menu[0].path} />
            {menu.map(el => <Route
                key={el.label}
                label={el.label}
                icon={el.icon}
                path={"/sa" + el.path}
                subpaths={el.subpaths}
            >
                {el.component}
            </Route>)}
            <Route path={"/sa/chat"}>
                <Chat />
            </Route>
            <Route path={"/sa/settings"}>
                <Settings />
            </Route>
        </Template>
    )
}

export default Component;
