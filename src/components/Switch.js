import React from 'react';
import { Label, CustomInput } from 'reactstrap';

export default function Component({ label, name, id }) {
    return (
        <CustomInput type="switch" label={label} />   
    )
}
