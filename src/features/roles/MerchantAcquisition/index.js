import React, { } from 'react';
import {
    FiShoppingCart,
    FiShoppingBag,
} from "react-icons/fi";
import {
    RiStore2Line
} from "react-icons/ri";

import Merchant from './Merchant';
import Product from './Product';
import Transaction from './Transaction';

import Settings from '../../settings';
import Chat from '../../chat';

import Template from '../components/Template';
import { Route, Redirect } from 'react-router-dom';

const menu = [
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
