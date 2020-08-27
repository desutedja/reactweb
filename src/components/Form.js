import React, { useRef } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';
import { Form } from 'reactstrap';

function Component({ children, onSubmit, loading, isModal=false, showSubmit = true, showCancel = false, onCancel, noContainer = false }) {

    let formRef = useRef();

    return (
        <>
        { isModal || noContainer ? null : <SectionSeparator /> }
        <div className={isModal || noContainer ? "" : "Container"}>
            <Form innerRef={formRef} className={isModal || noContainer ? "" : "Form"} onSubmit={async e => {
                e.preventDefault();

                const formData = new FormData(formRef.current);

                let dataObject = [...formData.entries()]
                    .filter(el => el[0] !== 'uploader')
                    .reduce((all, entry) => {
                        all[entry[0]] =
                        entry[1].includes('@') ? entry[1] :
                        entry[1].includes(entry[1].match(/[A-Za-z]/)) ? entry[1] :
                        entry[1].includes('[') ? JSON.parse(entry[1]) :
                        entry[1].includes('/') ? entry[1] :
                        entry[0].includes('billing') ? parseInt(entry[1], 10) :
                        entry[0].includes('date') ? (entry[1] + ' 00:00:00') :
                        entry[1].includes(':/') ? entry[1] :
                        entry[1].includes(':') ? (entry[1] + ':00') :
                        entry[0].includes('billing_duedate') ? (parseFloat(entry[1])) :
                        entry[0].includes('price') ? (parseFloat(entry[1])) :
                        entry[0].includes('tax') ? (parseFloat(entry[1])) :
                        isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999 ?
                        entry[1] : parseFloat(entry[1]);
                        return all
                    }, {});

                // console.log(dataObject)
                onSubmit(dataObject);
            }}>
                {children}
                {!isModal && <SectionSeparator className="mt-1" />}
                {!isModal && showSubmit && <div className="Form-control" style={{ justifyContent: 'right', flexDirection: 'row-reverse' }} >
                    <Loading loading={loading}>
                        {showCancel && <div className="btn btn-secondary mb-2 mt-1 ml-3" onClick={onCancel}>Cancel</div>}
                        <Button label="Submit" className="btn btn-primary ml-2"/>    
                    </Loading>
                </div>}
            </Form>
        </div>
        </>
    )
}

export default Component;
