import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { otpSuccess } from './slice';
import Button from '../../components/Button';
import Column from '../../components/layout/Column';
import Template from './template';

function Page() {
    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(otpSuccess(history));
            }}>
                <Column>
                    <label className="Auth-label" htmlFor="otp">OTP</label>
                    <p>01:00</p>
                    <input className="Auth-input" type="text" id="otp" name="otp" required
                        minLength="6" maxLength="6" size="24">
                    </input>
                    <Button
                        label="Submit"
                    />
                </Column>
            </form>
        </Template>
    )
}

export default Page;