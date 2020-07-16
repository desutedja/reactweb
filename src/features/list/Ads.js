import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Filter from '../../components/Filter';
import RangeInput from '../../components/RangeInput';
import { FiPlus } from 'react-icons/fi';
import { osType, genders, toSentenceCase } from '../../utils';

import Pill from '../../components/Pill';
import Button from '../../components/Button';

import Template from './components/Template';
import { getAds, deleteAds, setSelected } from '../slices/ads';
import { dateFormatter } from '../../utils';
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
        Header: "Start Date", accessor: row => dateFormatter(row.start_date)
    },
    {
        Header: "End Date", accessor: row => dateFormatter(row.end_date)
    },
    {
        Header: "Status", accessor: row => <Pill
            color={row.published && 'success'}
        >{row.published ? 'Published' : 'Draft'}</Pill>
    },
]

function Component() {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const [os, setOs] = useState('');
    const [ageFrom, setAgeFrom] = useState('');
    const [gender, setGender] = useState('');

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
                ageFrom.toLowerCase(),
                os.toLowerCase(),
                gender[0],
            ]}
            filters={[
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
