import React, { } from 'react';
import Loading from '../../../components/Loading';
import { FiAlertCircle } from 'react-icons/fi';

const SubmitButton = ({ loading = false, errors }) => {
    return (
        <Loading loading={loading}>
            {Object.keys(errors).length > 0 &&
                <div className="Input-error" style={{
                    marginTop: 16,
                }}>
                    <FiAlertCircle style={{
                        marginRight: 4
                    }} />
                    Your form is incomplete or there are some errors in your form.
                </div>
            }
            <button type="submit" style={{
                marginTop: 16,
            }} onClick={() => {
                console.log(errors)
            }}>Submit</button>
        </Loading>
    )
}

export default SubmitButton;
