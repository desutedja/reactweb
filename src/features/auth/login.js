import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slice';

function Page() {
    const dispatch = useDispatch();

    return (
        <div>
            Login
            <button onClick={() => dispatch(loginSuccess())}><Link to="/">Login</Link></button>
        </div>
    )
}

export default Page;