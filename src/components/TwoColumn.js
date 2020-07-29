import React from 'react';
import Row from './Row';
import Column from './Column';

function Component({ first, second, noborder=false }) {
    return (
        <Row style={{ padding: '4px', alignItems: 'center'}}>
            <Column flex={6} style={{ textAlign: 'left' }}>
                {first || " "}
            </Column>
            <Column flex={6} style={{ textAlign: 'right' }}>
                {second ? second : '-'}
            </Column>
        </Row>
    )
}

export default Component;
