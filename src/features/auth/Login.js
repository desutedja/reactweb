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
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);

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
                {step === 1 ? <>
                    <form className="Column w-100"
                    onSubmit={(e) => {
                        e.preventDefault();
                        dispatch(login(role, email, {setStep, setUserId}));
                    }}>
                        {/* <label className="Auth-label" htmlFor="email">Email or Handphone Number</label> */}
                        <input
                            className="Auth-input py-2 my-3 w-100" type="text" id="email"
                            required placeholder="Email or Handphone Number"
                            minLength="4"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button
                            label="Login"
                            className="w-100 py-2 mx-0"
                        />
                    </form>
                </> :
                <div>
                    <Button
                        label="Sent OTP via Email"
                        className="w-100 py-2 mx-0"
                        onClick={() => {
                            dispatch(sendOtp(role, userId, 'email', history));
                        }}
                    />
                    <Button
                        label="Sent OTP via SMS"
                        className="w-100 py-2 mx-0"
                        onClick={() => {
                            dispatch(sendOtp(role, userId, 'sms', history));
                        }}
                    />
                    <Button
                        label="back"
                        className="w-100 py-2 mx-0"
                        color="Danger"
                        onClick={() => setStep(1)}
                    />
                </div> }
            </Template>
        </>
    )
}

export default Page;
