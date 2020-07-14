import React, {  } from 'react';

import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { createManagement, editManagement } from '../slices/management';
import { useHistory } from 'react-router-dom';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import Input from './input';
import { managementSchema } from './schemas';

const managementPayload = {
    name: "",
    name_legal: "",
    logo: "",
    email: "",
    phone: "",
    website: "",
    pic_email: "",
    pic_name: "",
    pic_phone: "",
}

function Component() {
    const { selected } = useSelector(state => state.management);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template
            slice="management"
            payload={selected.id ? {
                ...managementPayload, ...selected,
                phone: selected.phone.slice(2),
                pic_phone: selected.pic_phone.slice(2),
            } : managementPayload}
            schema={managementSchema}
            formatValues={values => ({
                ...values,
                phone: '62' + values.phone,
                pic_phone: '62' + values.pic_phone,
            })}
            edit={data => dispatch(editManagement(data, history, selected.id))}
            add={data => dispatch(createManagement(data, history))}
            renderChild={props => {
                return (
                    <Form className="Form">
                        <Input {...props} label="Name" />
                        <Input {...props} label="Legal Name" name="name_legal" />
                        <Input {...props} label="Phone" prefix="+62"
                        />
                        <Input {...props} label="Email" />
                        <Input {...props} label="Website" />
                        <SectionSeparator />
                        <Input {...props} label="Logo" type="file" />
                        <SectionSeparator />
                        <Input {...props} label="PIC Name" />
                        <Input {...props} label="PIC Phone" prefix="+62" />
                        <Input {...props} label="PIC Email" />
                        <button>Submit</button>
                    </Form>
                )
            }}
        />
    )
}

export default Component;