import React, { useState, useRef } from 'react';

import Modal from './Modal';
import Loading from './Loading';
import { useDispatch } from 'react-redux';
import { getFile, post } from '../features/slice';

const UploadModal = ({ open, toggle, templateLink, uploadLink, uploadDataName, uploadFile, filename = 'template.xlsx' }) => {
    const fileInput = useRef();
    const [fileUpload, setFileUpload] = useState('');
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();

    return (
        <Modal
            isOpen={open}
            toggle={() => {
                setResult();
                toggle();
            }}
            title="Upload Bulk"
            okLabel={"Submit"}
            disablePrimary={loading || !fileUpload}
            disableSecondary={loading}
            onClick={result ?
                () => {
                    console.log(result)
                }
                :
                () => {
                    setLoading(true);
                    let formData = new FormData();
                    formData.append(uploadDataName, fileUpload);

                    dispatch(post(uploadLink, formData, res => {
                        console.log(res.data.data);
                        setResult(res.data.data);
                        setLoading(false);
                        toggle();
                    }, err => {
                        setLoading(false);
                        toggle();
                    }))
                }}
        >
            {/* {result ?
                <div style={{ maxHeight: '600px', overflow: 'scroll' }} >
                    {JSON.stringify(result)}
                </div>
                : */}
                <Loading loading={loading}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <input
                            ref={fileInput}
                            type="file"
                            onChange={e => {
                                setFileUpload(fileInput.current.files[0]);
                            }}
                        />
                        <button onClick={() => {
                            setLoading(true);
                            dispatch(getFile(templateLink, filename, res => {
                                setLoading(false);
                            }))
                        }} style={{
                            marginTop: 16
                        }}>Download Template</button>
                    </div>
                </Loading>
            {/* } */}
        </Modal>
    )
}

export default UploadModal;
