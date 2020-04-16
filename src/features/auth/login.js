import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slice';
import Button from '../../components/Button';
import Template from './template';

function Page() {
    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <form className="Column" onSubmit={(e) => {
                e.preventDefault();
                dispatch(loginSuccess(history));
            }}>
                <label className="Auth-label" htmlFor="email">Email</label>
                <input className="Auth-input" type="text" id="email" name="email" required
                    minLength="4" maxLength="24" size="24">
                </input>
                <Button
                    label="Login"
                />
            </form>
        </Template>
    )
}

export default Page;