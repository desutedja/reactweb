import React from 'react';
import { Badge } from 'reactstrap';

function Component({color, children}) {
    return <h5 style={{ marginBottom: '0' }} ><Badge style={{ minWidth: "80px", paddingTop: "6px", paddingBottom: "6px" }} pill color={color}>{children}</Badge></h5>
}

export default Component;
