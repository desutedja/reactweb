import React from 'react';
import { Badge } from 'reactstrap';

function Component({color, children}) {
    return <h5><Badge pill color={color}>{children}</Badge></h5>
}

export default Component;
