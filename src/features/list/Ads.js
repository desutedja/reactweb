import React, {  } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Pill from '../../components/Pill';
import Button from '../../components/Button';

import Template from './components/Template';
import { getAds, deleteAds, setSelected } from '../slices/ads';
import { dateFormatter } from '../../utils';
import AdsCell from '../../components/cells/Ads';

const columns = [
    // { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: row => <AdsCell id={row.id} /> },
    // {
    //     Header: "Target", accessor: row =>
    //         row.gender + ", " + row.age_from + "-" + row.age_to + ", " + row.os
    // },
    { Header: "Gender", accessor: "gender" },
    { Header: "Age", accessor: row => row.age_from + " - " + row.age_to },
    { Header: "Platform", accessor: "os" },
    { Header: "Priority", accessor: "total_priority_score" },
    // { Header: "Appear As", accessor: "appear_as" },
    // { Header: "Image", accessor: "" },
    // { Header: "Media Type", accessor: "media" },
    // { Header: "Media URL", accessor: "media_url" },
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
            // onClickDetails={row => dispatch(getAdsDetails(row,  history, url))}
        />
    )
}

export default Component;
