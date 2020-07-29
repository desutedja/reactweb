import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'reactstrap';

import { setInfo } from '../features/slice';

function Component() {
    const { info } = useSelector(state => state.main);

    let dispatch = useDispatch();

    return info.message ? (
        <div style={{
            marginTop: 16,
            marginLeft: 16,
        }}>
            <Alert color={info.color} isOpen={!!info.message} toggle={() => dispatch(setInfo({}))}>
                {info.message}
            </Alert>
        </div>
    ) : null
}

export default Component;