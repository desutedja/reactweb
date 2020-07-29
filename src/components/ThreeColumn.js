import React from 'react';
import Row from './Row';
import Column from './Column';

function Component({ first, second, third, noborder=false, two=false }) {
    // when two = true, use only first and third
    return (
        <Row style={{ padding: '4px', alignItems: 'center'}}>
            <Column flex={6} style={{ textAlign: 'left' }}>
                {first || " "}
            </Column>
            {two || <Column flex={6} style={{ textAlign: 'right' }}>
                {second}
            </Column>}
            <Column flex={6} style={{ textAlign: 'right' }}>
                {third ? third : '-'}
            </Column>
        </Row>
    )
}

export default Component;
