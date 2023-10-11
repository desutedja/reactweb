import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, stopAsync, sendOtp } from './slice';
import Button from '../../components/Button';
import CustomAlert from '../../components/CustomAlert';
import Template from './template';
import { closeAlert } from '../slice';
import ClinkLoader from '../../components/ClinkLoader';

function Page({ role }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { alert, title, content } = useSelector(state => state.main);
    const { auth } = useSelector(state => state);

    let dispatch = useDispatch();
    let history = useHistory();
    useEffect(() => {
        dispatch(stopAsync());
    }, [dispatch])

    return (
        <>
            {auth.loading && <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, .8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ClinkLoader />
            </div>}
            <CustomAlert isOpen={alert} toggle={() => dispatch(closeAlert())} title={title}
                content={content}
            />
            <Template role={role}>
                    <form className="Column w-100"
                    onSubmit={(e) => {
                        e.preventDefault();
                        dispatch(login(role, username, password, history));
                    }}>
                        {/* <label className="Auth-label" htmlFor="email">Email or Handphone Number</label> */}
                        <input
                            className="Auth-input py-2 my-3 w-100" type="text" id="username"
                            required placeholder="Username"
                            minLength="4"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input
                            className="Auth-input py-2 my-3 w-100" type="password" id="password"
                            required placeholder="Enter your password"
                            minLength="4"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            label="Login"
                            className="w-100 py-2 mx-0"
                        />
                    </form>
            </Template>
        </>
    )
}

export default Page;
