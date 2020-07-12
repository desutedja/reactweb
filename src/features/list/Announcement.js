import React, { } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import { Badge } from 'reactstrap';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import { getAnnoucement, getAnnouncementDetails, setSelected, deleteAnnouncement }
    from '../slices/announcement';
import { toSentenceCase } from '../../utils';

import Template from './components/Template';

function Component() {

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Title', accessor: row => <div className={"Link"}
            onClick={() => dispatch(getAnnouncementDetails(row, history, url))}>{row.title}</div>},
        // { Header: 'Topic', accessor: row => toSentenceCase(row.topic) },
        { Header: 'Consumer', accessor: row => toSentenceCase(row.consumer_role.replace(/_/g, ' ')) },
        {
            Header: 'Description', accessor: row => row.description.length > 50 ?
                parse(row.description).slice(0, 50) + '...' : parse(row.description)
        },
        { Header: 'Publisher', accessor: 'publisher_name' },
        {
            Header: 'Status', accessor: row => row.publish ?
                <h5><Badge pill color="success">Published</Badge></h5>
                :
                <h5><Badge pill color="secondary">Draft</Badge></h5>
        },
    ]

    return (
        <Template
            columns={columns}
            slice='announcement'
            getAction={getAnnoucement}
            deleteAction={deleteAnnouncement}
            actions={[
                <Button key="Add Announcement" label="Add Announcement" icon={<FiPlus />}
                    onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add");
                    }}
                />,
            ]}
            onClickDetails={row => dispatch(getAnnouncementDetails(row, history, url))}
        />
    )
}

export default Component;
