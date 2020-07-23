import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Filter from '../../components/Filter';
import RangeInput from '../../components/RangeInput';
import { FiPlus } from 'react-icons/fi';
import { osType, genders, toSentenceCase, days, daysLabel } from '../../utils';

import moment from 'moment';
import Pill from '../../components/Pill';
import Button from '../../components/Button';

import Template from './components/Template';
import { getAds, deleteAds, setSelected } from '../slices/ads';
import { dateTimeFormatterCell } from '../../utils';
import AdsCell from '../../components/cells/Ads';

const columns = [
    { Header: "ID", accessor: 'id' },
    { Header: "Title", accessor: row => <AdsCell id={row.id} data={row} /> },
    { Header: "Gender", accessor: row => row.gender ? row.gender : 'All' },
    { Header: "Age", accessor: row => row.age_from + " - " + row.age_to },
    { Header: "Platform", accessor: row => row.os ? row.os : 'All' },
    { Header: "Occupation", accessor: row => row.occupation ? toSentenceCase(row.occupation) : 'All' },
    { Header: "Weight", accessor: "total_priority_score" },
    {
        Header: "Start Date", accessor: row => dateTimeFormatterCell(row.start_date)
    },
    {
        Header: "End Date", accessor: row => dateTimeFormatterCell(row.end_date)
    },
    {
        Header: "Status", accessor: row => row.published ? (moment().isBefore(moment(row.end_date.slice(0, -1))) ? 
        <Pill color='success'>Published</Pill> : <Pill color='danger'>Ended</Pill>) : <Pill color='secondary'>Draft</Pill>
    },
]

function Component() {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const [os, setOs] = useState('');
    const [ageFrom, setAgeFrom] = useState('');
    const [gender, setGender] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        console.log(os, gender, ageFrom);
    }, [os, gender, ageFrom])

    return (
        <Template
            columns={columns}
            slice={'ads'}
            getAction={getAds}
            deleteAction={deleteAds}
            actions={[
                <Button key="Add Advertisement" label="Add Advertisement" icon={<FiPlus />}
                    onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add");
                    }}
                />
            ]}
            filterVars={[
                os.toLowerCase(),
                gender[0],
                ageFrom.toLowerCase(),
                day
            ]}
            filters={[
                {
                    hidex: day === "",
                    label: <p>{day ? "Day: " + days[day - 1] : "Day: All"}</p>,
                    delete: () => setDay(''),
                    component: toggleModal => (
                        <Filter
                            data={daysLabel}
                            onClick={el => {
                                setDay(el.value);
                                toggleModal(false);
                            }}
                            onClickAll={() => {
                                setDay('');
                                toggleModal(false);
                            }}
                        />
                    )
                },
                {
                    hidex: os === "",
                    label: <p>{os ? "OS: " + os : "OS: All"}</p>,
                    delete: () => setOs(''),
                    component: toggleModal => (
                        <Filter
                            data={osType}
                            onClick={el => {
                                setOs(el.value);
                                toggleModal(false);
                            }}
                            onClickAll={() => {
                                setOs('');
                                toggleModal(false);
                            }}
                        />
                    )
                },
                {
                    hidex: gender === "",
                    label: <p>{gender ? "Gender: " + gender : "Gender: All"}</p>,
                    delete: () => setGender(''),
                    component: toggleModal => (
                        <Filter
                            data={genders}
                            onClick={el => {
                                setGender(el.value);
                                toggleModal(false);
                            }}
                            onClickAll={() => {
                                setGender('');
                                toggleModal(false);
                            }}
                        />
                    )
                },
                {
                    hidex: ageFrom === "",
                    label: <p>{ageFrom ? "Ages: " + ageFrom : "Ages: Any"}</p>,
                    delete: () => setAgeFrom(''),
                    component: toggleModal => (
                        <RangeInput
                            onClick={el => {
                                setAgeFrom(el.value);
                                toggleModal(false);
                            }}
                            onClickAll={() => {
                                setAgeFrom('');
                                toggleModal(false);
                            }}
                        />
                    )
                }
            ]}
        />
    )
}

export default Component;
