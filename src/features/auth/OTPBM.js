import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { otpCheckBM, loginBM } from './slice';
import Button from '../../components/Button';
import Column from '../../components/Column';
import Template from './template';

const time = 5;

function Page() {
    const [otp, setOtp] = useState("");
    const [tick, setTick] = useState(time);

    const email = useSelector(state => state.auth.email);

    let dispatch = useDispatch();
    let history = useHistory();


    useEffect(() => {
        let timer = setInterval(() => setTick(tick - 1), 1000);

        return () => {
            clearInterval(timer);
        }
    }, [tick])

    return (
        <Template>
            <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(otpCheckBM(email, otp, history));
            }}>
                <Column>
                    <label className="Auth-label" htmlFor="otp">Kode OTP telah dikirim</label>
                    <p style={{
                        marginBottom: 20
                    }}>Silahkan periksa email anda</p>
                    <p style={{
                        marginBottom: 8
                    }}>(ini harusnya 1 menit, cuma di persingkat buat dev purposes)</p>
                    {tick > 0 ? <p>00:0{tick}</p> :
                        <button type="button" onClick={() => {
                            dispatch(loginBM(email));
                            setTick(time);
                        }}>Resend OTP</button>}
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