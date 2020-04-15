import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../auth/slice';
import { Link } from 'react-router-dom';

function Page() {
    const dispatch = useDispatch();

    return (
        <div>
            Menu
            <button onClick={() => dispatch(logout())}><Link to="/">Logout</Link></button>
        </div>
    )
}

export default Page;