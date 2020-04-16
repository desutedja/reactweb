import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../auth/slice';
import Button from '../../components/Button';


function Page() {
    let dispatch = useDispatch();

    return (
        <div>
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
            }}>
            <Button onClick={() => dispatch(logout())} label="Logout" />
            </div>
        </div>
    )
}

export default Page;