import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { otpCheck } from './slice';
import Button from '../../components/Button';
import Column from '../../components/Column';
import Template from './template';

function Page() {
    const [otp, setOtp] = useState("");

    const email = useSelector(state => state.auth.email);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(otpCheck(email, otp, history));
            }}>
                <Column>
                    <label className="Auth-label" htmlFor="otp">OTP</label>
                    <p>01:00</p>
                    <input className="Auth-input" type="text" id="otp"
                        required placeholder="####"
                        minLength="4" maxLength="4" size="30"
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                        label="Submit"
                    />
                </Column>
            </form>
        </Template>
    )
}

export default Page;