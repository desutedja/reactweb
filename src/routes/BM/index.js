import React, {  } from 'react';
import {
    FiBriefcase
} from "react-icons/fi";

import Template from '../components/Template';

const menu = [
    {
        icon: <FiBriefcase className="MenuItem-icon" />,
        label: "Management",
        route: "/management"
    },
]

function Component() {
    return (
        <Template role="bm" menu={menu} />
    )
}

export default Component;
