import React, { } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import Input from './input';
import { adminSchema } from './services/schemas';
import { createAdmin, editAdmin } from '../slices/admin';
import SubmitButton from './components/SubmitButton';

const adminPayload = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    group: "",
    status: "",

    group_label: "",
    status_label: "",
}

function AdminForm() {
    const { selected, loading } = useSelector(state => state.admin);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template
            slice="admin"
            payload={selected.id ? {
                ...adminPayload, ...selected,
                phone: selected.phone.slice(2),
            } : adminPayload}
            schema={adminSchema}
            formatValues={values => ({
                ...values,
                phone: '62' + values.phone,
            })}
            edit={data => dispatch(editAdmin(data, history, selected.id))}
            add={data => dispatch(createAdmin(data, history))}
            renderChild={props => {
                const { errors } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="First Name" name="firstname" />
                        <Input {...props} label="Last Name" name="lastname" />
                        <Input {...props} label="Email" />
                        <Input {...props} label="Phone" prefix="+62" />
                        <Input {...props} label="Group" options={[
                            { value: 'editor', label: 'Editor' },
                            { value: 'viewer', label: 'Viewer' },
                            { value: 'merchant_acquisition', label: 'Merchant Acquisition' },
                            { value: 'finance', label: 'Finance' },
                        ]} />
                        <Input {...props} label="Status" type="radio" options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]} />
                        <SubmitButton loading={loading} errors={errors} />
                    </Form>
                )
            }}
        />
    )
}

export default AdminForm;