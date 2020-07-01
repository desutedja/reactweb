import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Editor from '../../components/Editor';
import SectionSeparator from '../../components/SectionSeparator';
import { editAds, createAds } from '../slices/ads';
import Template from './components/Template';

function Component() {
    const [score, setScore] = useState(0);

    const [gender, setGender] = useState('');
    const [media, setMedia] = useState('');
    const [agef, setAgef] = useState('');
    const [aget, setAget] = useState('');
    const [os, setOS] = useState('');

    
    const { loading, selected } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        let i = 0;

        gender && i++;
        media && i++;
        (agef || aget) && i++;
        os && i++;

        setScore(i);
    }, [agef, aget, gender, media, os])

    return (
        <Template>
            <Form
                onSubmit={data => !selected.id || url.split('/').reverse()[0] === 'add' ?
                    dispatch(createAds( data, history))
                    :
                    dispatch(editAds( data, history, selected.id))
                }
                loading={loading}
            >
                <Input label="Appear as" type="radio" options={[
                    { value: "popup", label: "Popup" },
                    { value: "banner", label: "Banner" },
                ]} inputValue={selected.appear_as} />
                <SectionSeparator />

                <Input optional label="Gender" type="radio" options={[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                ]} inputValue={gender ? gender : selected.gender} setInputValue={setGender} />
                <Input optional label="Media" type="radio" options={[
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
                <Input optional label="OS" type="radio" options={[
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
                <Input label="Image/Video" name="media_url" type="file" accept="image/*, video/*"
                    inputValue={selected.media_url} />
                <Editor label="Content" name="content_description"
                    inputValue={selected.content_description} />
            </Form>
        </Template>
    )
}

export default Component;