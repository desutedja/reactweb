import React, { useEffect, useState } from 'react';
import {
    FiHome, FiUsers, FiZap, FiRss, FiVolume2, FiBarChart2
} from "react-icons/fi";
import {
    RiStore2Line, RiTaskLine,
    RiBuilding2Line, RiCustomerService2Line,
    RiAdvertisementLine,
} from "react-icons/ri";
import { Redirect, Route } from 'react-router-dom';

import Template from '../components/Template';
import { useSelector, useDispatch } from 'react-redux';

import { endpointAdmin } from '../../../settings';
import { get } from '../../slice';
import { setSelected } from '../../slices/building';

import Dashboard from './Dashboard';
import Ads from './Ads';
import Announcement from './Announcement';
import Billing from './Billing';
import Building from './Building';
import Resident from './Resident';
import Staff from './Staff';
import Task from './Task';
import Settings from '../../details/components/Detail';
import Chat from '../../chat';


const modules = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        path: "/dashboard",
        subpaths: [
            '/building',
            '/task',
            '/advertisement',
        ],
        component: <Dashboard />,
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
        subpaths: [
            '/unit',
            '/settlement'
        ],
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
];

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}

function Component() {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const id = auth.user.building_id;
    const { blacklist_modules } = useSelector(state => state.auth.user);
    const [data, setData] = useState({})
    const [menus, setMenus] = useState(modules || []);

    useEffect(() => {
        const modulesLabel = blacklist_modules?.map(module => module.module);
        const modulesFilter = menus.filter(menu => {
            const truthy = modulesLabel?.some(label => label === menu.label.toLowerCase())
            return !truthy
        })
        setMenus(modulesFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blacklist_modules])

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/details/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Template role="bm">
            <Redirect exact from={"/bm"} to={"/bm" + menus[0].path} />
            {menus.map(el => <Route
                key={el.label}
                label={el.label}
                icon={el.icon}
                path={"/bm" + el.path}
                subpaths={el.subpaths}
            >
                {el.component}
            </Route>)}
            <Route path={"/bm/chat"}>
                <Chat />
            </Route>
            <Route path={"/bm/settings"}>
                <div className="Container">
                    <Settings editPath="building/edit" labels={labels} data={data} />
                </div>
            </Route>
        </Template>
    )
}

export default Component;
