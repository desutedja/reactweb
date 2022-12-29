import React from 'react';
import Row from './Row';
import Column from './Column';

function Component({ first, second, noborder=false }) {
    return (
        <Row style={{ padding: '0', alignItems: 'center'}}>
            <Column flex={10} style={{ textAlign: 'left' }}>
                {first || " "}
            </Column>
            <Column flex={2} style={{ textAlign: 'right'}}>
                {second ? second : '-'}
            </Column>
        </Row>
    )
}

export default Component;
