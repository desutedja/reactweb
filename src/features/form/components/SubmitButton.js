import React, { } from 'react';
import Loading from '../../../components/Loading';
import { FiAlertCircle } from 'react-icons/fi';

const SubmitButton = ({ loading, errors }) => {
    return (
        <Loading loading={loading}>
            {Object.keys(errors).length > 0 &&
                <div className="Input-error" style={{
                    marginBottom: 16,
                }}>
                    <FiAlertCircle style={{
                        marginRight: 4
                    }} />
                    There are some errors in your form.
                </div>
            }
            <button>Submit</button>
        </Loading>
    )
}

export default SubmitButton;
