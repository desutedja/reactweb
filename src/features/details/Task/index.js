import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Details from '../components/Detail';
import Modal from '../../../components/Modal';
import Template from '../components/Template';

import Reports from './contents/Reports';
import { useParams } from 'react-router-dom';
import { get } from '../../slice';
import { endpointTask } from '../../../settings';

const detail = {
    "Information": [
        "ref_code",
        "title",
        "description",
        "task_type",
        "priority",
        "r_lat",
        "r_long",
        "status",
        "completed_on",
    ],
    "Attachments": []
};

const attachments = [
    "attachment_1",
    "attachment_2",
    "attachment_3",
    "attachment_4",
    "attachment_5",
]

const assignee = {
    "Profile": [
        "assignee_name",
        "assigned_by",
        "assigned_on",
        "assignee",
        "assignee_fee",
    ]
};

const requester = {
    "Profile": [
        "requester",
        "requester_name",
    ]
};

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointTask + '/admin/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <>
            <Modal disableFooter disableHeader isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                }} />
            </Modal>
            <Template
                loading={!data.task_id}
                labels={["Details", "Assignee", "Requester", "Reports"]}
                contents={[
                    <>
                        <Details data={data} labels={detail} editable={false} />
                        {data.attachment_1 ?
                            attachments.map(el => data[el] && <img src={data[el]} alt='attachment'
                                onClick={() => {
                                    setModal(true);
                                    setImage(data[el]);
                                }}
                                style={{
                                    height: 80,
                                    aspectRatio: 1,
                                }} />)
                            :
                            <div style={{
                                color: 'silver',
                                marginLeft: 8,
                            }}>None</div>
                        }
                    </>,
                    <Details imgPreview={true} data={data} labels={assignee} editable={false} />,
                    <Details data={data} labels={requester} editable={false} />,
                    <Reports />,
                ]}
            />
        </>
    )
}

export default Component;
