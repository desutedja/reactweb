import React, { useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Input from '../../components/Input';

import Template from './components/Template';
import { getAds, deleteAds, setSelected, getAdsDetails } from '../slices/Ads';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "content_name" },
    {
        Header: "Target", accessor: row =>
            row.gender + ", " + row.age_from + "-" + row.age_to + ", " + row.os
    },
    { Header: "Priority", accessor: "total_priority_score" },
    { Header: "Appear As", accessor: "appear_as" },
    { Header: "Image", accessor: "" },
    { Header: "Media Type", accessor: "media" },
    { Header: "Media URL", accessor: "media_url" },
    { Header: "Start Date", accessor: row => row.start_date?.split("T")[0] },
    { Header: "End Date", accessor: row => row.end_date?.split("T")[0] },
    { Header: "Status", accessor: "published" },
]

function Component() {
    const [agef, setAgef] = useState("");
    const [aget, setAget] = useState("");
    const [agefSet, setAgefSet] = useState("");
    const [agetSet, setAgetSet] = useState("");

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Template
            columns={columns}
            slice={'ads'}
            getAction={getAds}
            deleteAction={deleteAds}
            filters={[
                {
                    button: <Button key="Set Age Range"
                        label={(agefSet || agetSet) ?
                            ("Age: " + (agefSet ? agefSet : 10) + " - " +
                                (agetSet ? agetSet : 85)) : "Set Age Range"}
                        selected={agefSet || agetSet}
                    />,
                    component: toggleModal =>
                        <form style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }} onSubmit={() => {
                            setAgefSet(agef);
                            setAgetSet(aget);
                            toggleModal();
                        }} >
                            <Input type="number" min={10}
                                label="Age From" inputValue={agef}
                                setInputValue={setAgef} />
                            <Input type="number" max={85}
                                label="Age To" inputValue={aget}
                                setInputValue={setAget} />
                            <Button label="Set" />
                        </form>
                },
            ]}
            actions={[
                <Button key="Add Advertisement" label="Add Advertisement" icon={<FiPlus />}
                    onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add");
                    }}
                />
            ]}
            onClickDetails={row => dispatch(getAdsDetails(row,  history, url))}
        />
    )
}

export default Component;
