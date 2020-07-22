import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './slice';
import Button from '../../components/Button';
import CustomAlert from '../../components/CustomAlert';
import Template from './template';
import { closeAlert } from '../slice';
import ClinkLoader from '../../components/ClinkLoader';

function Page({ role }) {
    const [email, setEmail] = useState("")

    const { alert, title, content } = useSelector(state => state.main);
    const { auth } = useSelector(state => state);

    let dispatch = useDispatch();
    let history = useHistory();

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
                <form className="Column" style={{
                    alignItems: 'center',
                }} onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(login(role, email, history));
                }}>
                    <label className="Auth-label" htmlFor="email">Email</label>
                    <input
                        className="Auth-input" type="text" id="email"
                        required placeholder="example@email.com"
                        minLength="4" size="30"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                        label="Login"
                    />
                </form>
            </Template>
        </>
    )
}

export default Page;
