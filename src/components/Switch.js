import React from 'react';
import { Label, CustomInput } from 'reactstrap';

function Component({ label, name, id }) {
    return (
        <CustomInput type="switch" label={label} />   
    )
}
