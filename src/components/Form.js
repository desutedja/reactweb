import React, { useRef } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';

function Component({ children, onSubmit, loading }) {
    let formRef = useRef();

    return (
        <form ref={formRef} className="Form" onSubmit={e => {
            e.preventDefault();

            const formData = new FormData(formRef.current);
            const allEntries = [...formData.entries()].reduce((all, entry) => {
                all[entry[0]] =
                    isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999
                        ? entry[1] : parseFloat(entry[1])
                return all
            }, {});
            console.log(allEntries);

            onSubmit(allEntries);
        }}>
            {children}
            <SectionSeparator />
            <div className="Form-control">
                <Loading loading={loading}>
                    <Button label="Submit" />
                </Loading>
            </div>
        </form>
    )
}

export default Component;