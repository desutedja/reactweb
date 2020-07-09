import React, { useState, useEffect, useRef } from 'react';
import MoonLoader from "react-spinners/MoonLoader";

import { storageRef } from '../../../firebase';

function FileInput(props) {
    const {
        label = "", name, optional, inputValue, setInputValue, onClick,
    } = props;

    const [value, setValue] = useState(inputValue ? inputValue : "");
    const [uploading, setUploading] = useState(false);
    let uploader = useRef();

    useEffect(() => {
        inputValue && setValue(inputValue);
    }, [inputValue])

    return <div className="Input-container">
        {uploading && <div className="InputIcon">
            <MoonLoader
                size={14}
                color={"grey"}
                loading={uploading}
            />
        </div>}
        <input
            type="url"
            id={label}
            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
            required={!optional}
            placeholder={label}
            size="40"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                setInputValue && setInputValue(e.target.value);
            }}
            onClick={onClick}
        />
        <input
            ref={uploader}
            accept="image/*"
            type="file"
            id={label}
            name="uploader"
            required={false}
            onChange={async (e) => {
                let file = uploader.current.files[0];

                setValue('Uploading file...');
                setInputValue && setInputValue('Uploading file...');
                setUploading(true);

                let ref = storageRef.child('building_logo/' + Date.now() + '-' + file.name);
                await ref.put(file).then(function (snapshot) {
                    console.log(snapshot, 'File uploaded!');

                    snapshot.ref.getDownloadURL().then(url => {
                        setValue(url);
                        setInputValue && setInputValue(url);
                    });

                    setUploading(false);
                })
            }}
            onClick={onClick}
        />
    </div>;
}

export default FileInput;
