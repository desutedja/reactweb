import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch, useParams } from 'react-router-dom';
import {
    useDispatch
} from 'react-redux';

import Button from '../../../components/Button';
import Modal from '../../../components/Modal';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Content from './contents/Content';
import Schedule from './contents/Schedule';
import { get, setConfirmDelete } from '../../slice';
import { endpointAds } from '../../../settings';
import { deleteAds, setSelected, publishAds } from '../../slices/ads';

const details = {
    "Information": [
        'age_from',
        'age_to',
        'appear_as',
        'created_on',
        'default_priority_score',
        'deleted',
        'end_date',
        'gender',
        'id',
        'media',
        'media_index',
        'media_type',
        'media_url',
        'modified_on',
        'os',
        'published',
        'start_date',
        'total_actual_click',
        'total_actual_view',
        'total_priority_score',
        'total_repeated_click',
        'total_repeated_view',
    ]
}

function Component() {
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointAds + '/management/ads/' + id, res => {
            setData(res.data.data);
            setSelected(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <>
            <Modal isOpen={modal} disableFooter={true} toggle={() => setModal(false)}
                title="Preview"
            >
                <div style={{
                    width: '100%',
                    height: 'calc(614 / 1080 * 450px)',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <div style={{
                        height: 'calc(164 / 1080 * 450px)',
                        flex: 1,
                        position: 'absolute',
                        right: 0,
                        left: 0,
                        zIndex: 99,
                        backgroundColor: '#fafafaaa',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        Topbar Area
                    </div>
                    <img style={{
                        width: '100%',
                    }} src={data.content_image} alt="content_image" />
                </div>
            </Modal>
            <Template
                labels={["Details", "Content", "Schedules"]}
                contents={[
                    <Detail type="Advertisement" data={data} labels={details}
                        onDelete={() => dispatch(setConfirmDelete("Are you sure to delete this item?",
                            () => dispatch(deleteAds(data, history))
                        ))}
                        renderButtons={() => [
                            <Button
                                label="Duplicate"
                                onClick={() => {
                                    dispatch(setSelected({ ...data, id: null }));
                                    history.push(
                                        url.split('/').slice(0, -1).join('/') + "/add"
                                    )
                                }
                                }
                            />,
                            <Button label="Preview" onClick={() => {
                                setModal(true);
                            }} />,
                            <Button
                                disabled={!!data.published}
                                label={data.published ? "Published" : "Publish"}
                                onClick={() => dispatch(publishAds(data))}
                            />
                        ]}
                    />,
                    <Content />,
                    <Schedule />,
                ]}
            />
        </>
    )
}

export default Component;
