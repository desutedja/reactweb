import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch, useLocation, useParams } from 'react-router-dom';
import {
    // useSelector,
    useDispatch
} from 'react-redux';

import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Content from './contents/Content';
import Schedule from './contents/Schedule';
import { get } from '../../slice';
import { endpointAds } from '../../../settings';

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
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let history = useHistory();
    let { state } = useLocation();
    let { url } = useRouteMatch();
    let { id } = useParams();

    useEffect(() => {
        !state && dispatch(get(endpointAds + '/management/ads/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id, state])

    return (
        <Template
            labels={["Details", "Content", "Schedules"]}
            contents={[
                <Detail type="Advertisement" data={state ? state : data} labels={details}
                    renderButtons={() => [
                        <Button
                            label="Duplicate"
                            onClick={() => history.push(
                                url.split('/').slice(0, -1).join('/') + "/add"
                            )}
                        />,
                        <Button label="Preview" onClick={() => { }} />,
                        <Button
                            disabled={state ? !!state.published : !!data.published}
                            label={state ? 
                                state.published ? "Published" : 
                                data.published ? "Published" : "Publish" : "Publish"}
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
