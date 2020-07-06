import React, { useEffect, useState } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { createManagement, editManagement } from '../slices/management';
import { useHistory } from 'react-router-dom';
import Template from './components/Template';

function Component() {
    
    const { loading, selected } = useSelector(state => state.management);
    const [validation, setValidation] = useState({
        tel: {
            value: '',
            isErr: false
        }
    })

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <Form
                onSubmit={data => selected.id ?
                    dispatch(editManagement( data, history, selected.id))
                    :
                    dispatch(createManagement( data, history))}
                loading={loading}
            >
                <Input label="Name" inputValue={selected.name} />
                <Input label="Legal Name" name="name_legal" inputValue={selected.name_legal} />
                <Input label="Phone" type="tel" placeholder="e.g 6281xxxxxxx"
                    inputValue={selected.phone || validation.tel.value}
                    isValidate={validation.tel.isErr}
                    validationMsg="The phone number must contain 62" onFocus={(e) => {
                        setValidation({
                            ...validation,
                            tel: {
                                ...validation.tel,
                                value: '62'
                            }
                        })
                        console.log(validation.tel)
                    }}
                    onBlur={(e) => {
                        if (e.target.value.includes(e.target.value.match(/^62/))) {
                            setValidation({
                                ...validation,
                                tel: {
                                    ...validation.tel,
                                    isErr: false
                                }
                            })
                        } else setValidation({
                            ...validation,
                            tel: {
                                ...validation.tel,
                                isErr: true
                            }
                        })
                    }}
                />
                <Input label="Email" type="email" inputValue={selected.email} />
                <Input label="Website" type="url" inputValue={selected.website} />
                <SectionSeparator />
                <Input label="Logo" type="file" inputValue={selected.logo} />
                <SectionSeparator />
                <Input label="PIC Name" inputValue={selected.pic_name} />
                <Input label="PIC Phone" type="tel" inputValue={selected.pic_phone} />
                <Input label="PIC Email" type="email" inputValue={selected.pic_email} />
            </Form>
        </Template>
    )
}

export default Component;