import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import SectionSeparator from '../../components/SectionSeparator';
import { editAds, createAds } from '../slices/ads';

import Template from "./components/TemplateWithFormik";
import { Form, FieldArray, Field } from 'formik';
import { adsSchema } from "./schemas";
import Input from './input';
import { days } from '../../utils';

const adsPayload = {
    appear_as: "banner",
    media: "apps",
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),

    gender: "A",
    occupation: "all",
    age_from: 10,
    age_to: 85,
    os: "all",

    content_name: "",
    content_type: "image",
    content_image: "",
    content_video: "",
    content_description: "",

    total_priority_score: 0,

    schedules: [
        {
            day: 1,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 2,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 3,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 4,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 5,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 6,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
        {
            day: 7,
            hour_from: '00:00:00',
            hour_to: '00:00:00',
        },
    ],
}

function Component() {
    const [score, setScore] = useState(0);

    const [gender, setGender] = useState('A');
    const [agef, setAgef] = useState('10');
    const [aget, setAget] = useState('85');
    const [job, setJob] = useState('all');
    const [os, setOS] = useState('all');

    const { selected } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        let i = 0;

        gender !== 'A' && i++;
        job !== 'all' && i++;
        (agef !== '10' || aget !== '85') && i++;
        os !== 'all' && i++;

        setScore(i);
    }, [agef, aget, gender, job, os])

    return (
        <Template
            slice="ads"
            payload={selected.id ? {
                ...adsPayload, ...selected,
                gender: selected.gender ? selected.gender : 'A',
                occupation: selected.occupation ? selected.occupation : 'all',
                os: selected.os ? selected.os : 'all',
                start_date: selected.start_date.split('T')[0],
                end_date: selected.end_date.split('T')[0],
            } : adsPayload}
            schema={adsSchema}
            formatValues={values => {
                const { schedules, ...ads } = values;

                return {
                    ads: {
                        ...ads,
                        gender: ads.gender === 'A' ? null : ads.gender,
                        occupation: ads.occupation === 'all' ? null : ads.occupation,
                        os: ads.os === 'all' ? null : ads.os,
                        start_date: ads.start_date + ' 00:00:00',
                        end_date: ads.end_date + ' 23:59:59',
                    },
                    schedules: schedules,
                }
            }}
            edit={data => dispatch(editAds(data, history, selected.id))}
            add={data => dispatch(createAds(data, history))}
            renderChild={props => {
                const { values } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Appear as" type="radio" options={[
                            { value: "popup", label: "Popup" },
                            { value: "banner", label: "Banner" },
                        ]} />
                        <Input {...props} optional label="Media" type="radio" options={[
                            { value: "apps", label: "Apps" },
                            { value: "url", label: "URL" },
                        ]} />
                        <Input {...props} label="Start Date" type="date" />
                        <Input {...props} label="End Date" type="date" />
                        <SectionSeparator />

                        <Input {...props} optional label="Gender" type="radio" options={[
                            { value: "A", label: "All" },
                            { value: "M", label: "Male" },
                            { value: "F", label: "Female" },
                        ]}
                            onChange={el => setGender(el)}
                        />
                        <Input {...props} label="Occupation" options={[
                            { value: 'all', label: 'All' },
                            { value: 'unemployed', label: 'Unemployed' },
                            { value: 'student', label: 'Student' },
                            { value: 'university_student', label: 'University Student' },
                            { value: 'professional', label: 'Professional' },
                            { value: 'housewife', label: 'Housewife' },
                        ]}
                            onChange={el => setJob(el)}
                        />
                        <Input {...props} optional label="Age From" type="number"
                            min={10} suffix="years"
                            onChange={el => setAgef(el)}
                        />
                        <Input {...props} optional label="Age To" type="number"
                            max={85} suffix="years"
                            onChange={el => setAget(el)}
                        />
                        <Input {...props} optional label="OS" type="radio" options={[
                            { value: "all", label: "All" },
                            { value: "android", label: "Android" },
                            { value: "ios", label: "iOS" },
                        ]}
                            onChange={el => setOS(el)}
                        />
                        <Input {...props} label="Priority" name="total_priority_score"
                            type="number"
                            externalValue={score}
                        />
                        <SectionSeparator />

                        <Input {...props} label="Title" name="content_name" type="textarea" />
                        <Input {...props} label="Media Type" name="content_type" type="radio" options={[
                            { value: 'image', label: 'Image' },
                            { value: 'video', label: 'Video' },
                        ]} />
                        {values.content_type === 'image' &&
                            <Input {...props} label="Image" name="content_image" type="file" accept="image/*" />
                        }
                        {values.content_type === 'video' &&
                            <Input {...props} label="Video" name="content_video" type="file" accept="video/*" />
                        }
                        <Input {...props} label="Content" name="content_description" type="textarea" />

                        {!selected.id && <>
                            <p className="Input-label" style={{
                                marginBottom: 16,
                            }}>Schedules</p>
                            <FieldArray
                                name="schedules"
                                render={arrayHelpers => (
                                    <div className="Input" style={{

                                    }}>
                                        {values.schedules.map((friend, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <p style={{
                                                    marginRight: 16,
                                                    flex: 1,
                                                }}>{days[values.schedules[index].day - 1]}: </p>
                                                <Field name={`schedules.${index}.hour_from`} type="time" step="1" />
                                                <p style={{
                                                    marginLeft: 16,
                                                    marginRight: 16,
                                                    flex: 1,
                                                    textAlign: 'center',
                                                }}>-</p>
                                                <Field name={`schedules.${index}.hour_to`} type="time" step="1" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </>}
                        <button onClick={() => console.log(values)}>Submit</button>
                    </Form>
                )
            }}
        />
    )
}

export default Component;