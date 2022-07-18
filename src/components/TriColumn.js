import React from 'react';
import Row from './Row';
import Column from './Column';

function Component({ first, second, third, noborder=false }) {
    return (
        <Row style={{ padding: '0', alignItems: 'center'}}>
            <Column flex={4} style={{ textAlign: 'left' }}>
                {first || " "}
            </Column>
            <Column flex={4} style={{ textAlign: 'center' }}>
                {second ? second : '-'}
            </Column>
            <Column flex={4} style={{ textAlign: 'right' }}>
                {third ? third : '-'}
            </Column>
        </Row>
    )
}

export default Component;
