import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch, useLocation, useParams } from 'react-router-dom';
import {
    useDispatch
} from 'react-redux';

import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Content from './contents/Content';
import Schedule from './contents/Schedule';
import { get } from '../../slice';
import { endpointAds } from '../../../settings';
import { deleteAds, setSelected } from '../../slices/ads';

const details = {
    "Information": [
        'age_from',
        'age_to',
        'appear_as',
        'content_description',
        'content_image',
        'content_name',
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
    let { state } = useLocation();
    const [data, setData] = useState(state ? state : {});

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();
    let { id } = useParams();

    useEffect(() => {
        !state && dispatch(get(endpointAds + '/management/ads/' + id, res => {
            setData(res.data.data);
            setSelected(res.data.data);
        }))
    }, [data, dispatch, id, state])

    return (
        <Template
            labels={["Details", "Content", "Schedules"]}
            contents={[
                <Detail type="Advertisement" data={data} labels={details}
                    onDelete={() => !data.published ? dispatch(deleteAds(data, history)) : null}
                    renderButtons={() => [
                        <Button
                            label="Duplicate"
                            onClick={() => {
                                dispatch(setSelected({...data, id: null}));
                                history.push(
                                    url.split('/').slice(0, -1).join('/') + "/add"
                                )}
                            }
                        />,
                        <Button label="Preview" onClick={() => { }} />,
                        <Button
                            disabled={!!data.published}
                            label={data.published ? "Published" : "Publish"}
                            onClick={() => { }}
                        />
                    ]}
                />,
                <Content />,
                <Schedule />,
            ]}
        />
    )
}

export default Component;
