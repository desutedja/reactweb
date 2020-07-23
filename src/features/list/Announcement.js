import React, { } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import { Badge } from 'reactstrap';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import { getAnnoucement, setSelected, deleteAnnouncement }
    from '../slices/announcement';
import { toSentenceCase } from '../../utils';

import Template from './components/Template';

function Component() {

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const { role } = useSelector(state => state.auth)

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Title', accessor: row => <a href={"/" + role + "/announcement/" + row.id}><b>{row.title}</b></a>},
        { Header: 'Consumer', accessor: row => toSentenceCase(row.consumer_role.replace(/_/g, ' ')) },
        // {
        //    Header: 'Description', accessor: row => parse(row.description) /*.length > 50 ?
        //        parse(row.description).slice(0, 50) + '...' : parse(row.description) */
        //},
        { Header: 'Publisher', accessor: row => <><a href={
            "/" + role + "/" + (row.publisher_role === 'sa' ? "admin" : "staff") + "/" + row.publisher
        }>{row.publisher_name}</a></> },
        { Header: 'Publisher Role', accessor: row => row.publisher_role === 'sa' ? 'Super Admin' : 'PIC Admin' },
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
        />
    )
}

export default Component;
