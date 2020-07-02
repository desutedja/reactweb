import React from 'react';
import { Badge } from 'reactstrap';

function Component({color, children}) {
    return <h5 style={{ marginBottom: '0' }} ><Badge pill color={color}>{children}</Badge></h5>
}

export default Component;
