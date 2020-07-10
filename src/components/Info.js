import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'reactstrap';

import { setInfo } from '../features/slice';

function Component() {
    const { info } = useSelector(state => state.main);

    let dispatch = useDispatch();

    return (
        <div style={{
            marginRight: 32,
        }}>
            <Alert color={info.color} isOpen={!!info.message} toggle={() => dispatch(setInfo({}))}>
                {info.message}
            </Alert>
        </div>
    )
}

export default Component;