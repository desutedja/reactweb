import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './slice';
import Button from '../../components/Button';
import CustomAlert from '../../components/CustomAlert';
import Template from './template';
import { closeAlert } from '../slice';

function Page() {
    const [email, setEmail] = useState("")

    const { alert, title, content } = useSelector(state => state.main);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <>
            <CustomAlert isOpen={alert} toggle={() => dispatch(closeAlert())} title={title}
                content={content}
            />
            <Template>
                <form className="Column" onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(login(email, history));
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