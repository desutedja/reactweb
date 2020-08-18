import React, { } from 'react';
import Avatar from 'react-avatar';

import './style.css';


export default function ({ data }) {
    return (
        <Avatar className="Item-avatar" size="40" src={data.icon}
        name={data.icon} round
        email={data.icon} />
    );
}
