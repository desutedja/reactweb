import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Editor from '../../components/Editor';
import SectionSeparator from '../../components/SectionSeparator';
import { editAds, createAds } from './slice';

function Component() {
    const [score, setScore] = useState(0);

    const [gender, setGender] = useState('');
    const [media, setMedia] = useState('');
    const [agef, setAgef] = useState('');
    const [aget, setAget] = useState('');
    const [os, setOS] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        let i = 0;

        gender && i++;
        media && i++;
        (agef || aget) && i++;
        os && i++;

        setScore(i);
    }, [agef, aget, gender, media, os])

    return (
        <div>
            <Form
                onSubmit={data => !selected.id || url.split('/').reverse()[0] === 'add' ?
                    dispatch(createAds(headers, data, history))
                    :
                    dispatch(editAds(headers, data, history, selected.id))
                }
                loading={loading}
            >
                <Input label="Appear as" type="select" options={[
                    { value: "popup", label: "Popup" },
                    { value: "banner", label: "Banner" },
                ]} inputValue={selected.appear_as} />
                <SectionSeparator />

                <Input optional label="Gender" type="select" options={[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                ]} inputValue={gender ? gender : selected.gender} setInputValue={setGender} />
                <Input optional label="Media" type="select" options={[
                    { value: "apps", label: "Apps" },
                    { value: "url", label: "URL" },
                ]} inputValue={media ? media : selected.media} setInputValue={setMedia} />
                <Input optional label="Age From" type="number"
                    inputValue={agef ? agef : selected.age_from} setInputValue={setAgef}
                    min={10}
                />
                <Input optional label="Age To" type="number"
                    inputValue={aget ? aget : selected.age_to} setInputValue={setAget}
                    max={85}
                />
                <Input optional label="OS" type="select" options={[
                    { value: "android", label: "Android" },
                    { value: "ios", label: "iOS" },
                ]} inputValue={os ? os : selected.os} setInputValue={setOS} />
                <Input label="Start Date" type="date" inputValue={selected.start_date?.split('T')[0]} />
                <Input label="End Date" type="date" inputValue={selected.end_date?.split('T')[0]} />
                <Input label="Priority" name="total_priority_score"
                    type="number"
                    inputValue={score ? score : selected.total_priority_score}
                    setInputValue={setScore}
                />
                <SectionSeparator />

                <Input label="Title" name="content_name" type="textarea"
                    inputValue={selected.content_name} />
                <Editor label="Content" name="content_description" />
            </Form>
        </div>
    )
}

export default Component;