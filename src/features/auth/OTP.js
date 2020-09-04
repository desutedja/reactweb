import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { otpCheck } from './slice';
import Button from '../../components/Button';
import Column from '../../components/Column';
import CustomAlert from '../../components/CustomAlert';
import Template from './template';
import { closeAlert, post  } from '../slice';
import { stopAsync } from './slice';
import { endpointAdmin } from '../../settings';
import ClinkLoader from '../../components/ClinkLoader';

const time = 60;

function Page({ role }) {
    const [otp, setOtp] = useState("");
    const [tick, setTick] = useState(time);

    const { alert, title, content } = useSelector(state => state.main);
    const { auth } = useSelector(state => state);

    const dispatch = useDispatch();
    const history = useHistory();
    const { method = '...', userId, email } = history?.location?.state ? history.location.state : null;

    useEffect(() => {
        let timer = setInterval(() => setTick(tick - 1), 1000);

        return () => {
            clearInterval(timer);
        }
    }, [tick]);

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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(otpCheck(role, email, otp, history));
                }}>
                    <Column style={{
                        alignItems: 'center',
                    }}>
                        <label className="Auth-label" htmlFor="otp">Kode OTP telah dikirim</label>
                        <p style={{
                            marginBottom: 20
                        }}>Silahkan periksa {method} anda</p>
                        {/* <p style={{
                            marginBottom: 8
                        }}>(ini harusnya 1 menit, cuma di persingkat buat dev purposes)</p> */}
                        {tick > 0 ? <p>00:{tick}</p> :
                            <button
                                className="py-2"
                                type="button"
                                onClick={() => {
                                    dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
                                        + '/send_otp', {
                                        user_id: Number(userId),
                                        method
                                    }, res => {
                                        dispatch(stopAsync());
                                    }, (err) => {
                                        dispatch(stopAsync());
                                        console.log("Failed", err);
                                    }, () => {
                                    }))
                                    // dispatch(login(role, email, history));
                                    setTick(time);
                            }}>Resend OTP</button>}
                        <input className="Auth-input py-2 my-3 w-100" type="text" id="otp"
                            required placeholder="####"
                            minLength="4" maxLength="4" size="30"
                            value={otp} onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                            label="Submit"
                            className="w-100 mx-0 py-2"
                        />
                        <Button
                            label="Back to Login Page"
                            className="w-100 py-2 mx-0"
                            color="Danger"
                            onClick={() => history.goBack()}
                        />
                    </Column>
                </form>
            </Template>
        </>
    )
}

export default Page;