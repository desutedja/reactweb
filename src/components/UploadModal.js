import React, { useState, useRef } from 'react';

import Modal from './Modal';
import Loading from './Loading';
import { useDispatch } from 'react-redux';
import { getFile } from '../features/slice';

const UploadModal = ({ open, toggle, templateLink }) => {
    const fileInput = useRef();
    const [uploadResult, setUploadResult] = useState(false);
    const [fileUpload, setFileUpload] = useState('');
    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();

    return (
        <Modal
            isOpen={open}
            toggle={() => {
                setUploadResult();
                toggle();
            }}
            title="Upload Bulk"
            okLabel={"Submit"}
            disablePrimary={loading || !fileUpload}
            disableSecondary={loading}
            onClick={uploadResult ?
                () => {
                    console.log(uploadResult)
                }
                :
                () => {
                    let formData = new FormData();
                    formData.append('file', fileUpload);

                    console.log(formData)
                }}
        >
            {uploadResult ?
                <div style={{ maxHeight: '600px', overflow: 'scroll' }} >

                </div>
                :
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
                            dispatch(getFile(templateLink, 'template.xlsx', res => {
                                setLoading(false);
                            }))
                        }} style={{
                            marginTop: 16
                        }}>Download Template</button>
                    </div>
                </Loading>
            }
        </Modal>
    )
}

export default UploadModal;
