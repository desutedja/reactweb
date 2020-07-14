import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Filter from '../../components/Filter';
import RangeInput from '../../components/RangeInput';
import { FiPlus } from 'react-icons/fi';
import { osType, genders } from '../../utils';

import Pill from '../../components/Pill';
import Button from '../../components/Button';

import Template from './components/Template';
import { getAds, deleteAds, setSelected } from '../slices/ads';
import { dateFormatter } from '../../utils';
import AdsCell from '../../components/cells/Ads';

const columns = [
    { Header: "Title", accessor: row => <AdsCell id={row.id} /> },
    { Header: "Gender", accessor: "gender" },
    { Header: "Age", accessor: row => row.age_from + " - " + row.age_to },
    { Header: "Platform", accessor: "os" },
    { Header: "Priority", accessor: "total_priority_score" },
    { Header: "Date", accessor: row => dateFormatter(row.start_date) + ' - ' 
        + dateFormatter(row.end_date)},
    { Header: "Status", accessor: row => <Pill
        color={row.published && 'success'}
    >{row.published ? 'Published' : 'Draft' }</Pill>},
]

function Component() {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const [os, setOs] = useState('');
    const [ageFrom, setAgeFrom] = useState('');
    const [gender, setGender] = useState('');
    const [media, setMedia] = useState('');

    const mediaType = [
        { label: 'Apps', value: 'Apps' },
        { label: 'URL', value: 'URL' }
    ]

    useEffect(() => {
        console.log(os, gender, ageFrom, media);
    }, [os, gender, ageFrom, media])

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
                // ageTo.toLowerCase(),
                os.toLowerCase(),
                gender[0],
                media.toLowerCase(),
                // appearAs.toLowerCase()
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
                    hidex: media === "",
                    label: <p>{media ? "Media: " + media : "Media: All"}</p>,
                    delete: () => setMedia(''),
                    component: toggleModal => (
                        <Filter
                            data={mediaType}
                            onClick={el => {
                                setMedia(el.value);
                                toggleModal(false);
                            }}
                            onClickAll={() => {
                                setMedia('');
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
            // onClickDetails={row => dispatch(getAdsDetails(row,  history, url))}
        />
    )
}

export default Component;
