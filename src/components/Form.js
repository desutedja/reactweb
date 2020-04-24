import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';
import { storageRef } from '../firebase';

function Component({ children, onSubmit, loading }) {

    let formRef = useRef();

    return (
        <form ref={formRef} className="Form" onSubmit={async e => {
            // console.log('sth');

            e.preventDefault();

            const formData = new FormData(formRef.current);

            const getData = async () => {
                return Promise.all([...formData.entries()].map(async entry => {
                    if (entry[1] instanceof File) {
                        console.log(entry[0], 'is a file, uploading...');

                        let ref = storageRef.child('building_logo/' + Date.now() + '-' + entry[1].name);
                        await ref.put(entry[1]).then(function (snapshot) {
                            console.log(snapshot, 'File uploaded!');

                            snapshot.ref.getDownloadURL().then(url => entry[1] = url);
                        })

                    }
                    return entry;
                }))
            }

            let arrayData;

            await getData().then(data => {
                arrayData = data
            })

            console.log(arrayData);

            let dataObject = [...formData.entries()].reduce((all, entry) => {
                all[entry[0]] =
                    isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999
                        ? entry[1] : parseFloat(entry[1]);
                console.log(entry[1]);

                return all
            }, {});

            console.log(dataObject);

            onSubmit(dataObject);
        }}>
            {children}
            <SectionSeparator />
            <div className="Form-control">
                <Loading loading={loading}>
                    <Button label="Submit" onClick={() => {
                        // console.log('sth');
                    }} />
                </Loading>
            </div>
        </form>
    )
}

export default Component;