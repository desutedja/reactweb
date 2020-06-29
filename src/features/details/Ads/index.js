import React, {  } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Content from './contents/Content';
import Schedule from './contents/Schedule';

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
    const { selected } = useSelector(state => state.ads);

    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Template
            labels={["Details", "Content", "Schedules"]}
            contents={[
                <Detail type="Advertisement" data={selected} labels={details}
                    renderButtons={() => [
                        <Button
                            label="Duplicate"
                            onClick={() => history.push(
                                url.split('/').slice(0, -1).join('/') + "/add"
                            )}
                        />,
                        <Button label="Preview" onClick={() => { }} />,
                        <Button
                            disabled={!!selected.published}
                            label={selected.published ? "Published" : "Publish"}
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
