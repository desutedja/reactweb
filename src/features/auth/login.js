import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slice';
import Button from '../../components/Button';

function Page() {
    const dispatch = useDispatch();

    return (
        <div className="Login">
            <div className="Login-center">
                <Button
                    onClick={() => dispatch(loginSuccess())}
                    label={<Link to="/">Login</Link>}
                />
            </div>
        </div>
    )
}

export default Page;