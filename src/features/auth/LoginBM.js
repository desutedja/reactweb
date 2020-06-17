import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginBM } from './slice';
import Button from '../../components/Button';
import Template from './template';

function Page() {
    const [email, setEmail] = useState("")

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <form className="Column" onSubmit={(e) => {
                e.preventDefault();
                dispatch(loginBM(email, history));
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
    )
}  

export default Page;