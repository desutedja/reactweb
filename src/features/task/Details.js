import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { dateFormatter } from '../../utils';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const exception = [
    'modified_on', 'deleted', 'pic_profile',
    'task_reports', 'attachments',
    'attachment_1', 'attachment_2', 'attachment_3', 'attachment_4', 'attachment_5',
];

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const selected = useSelector(state => state.task.selected);

    let history = useHistory();
    let { url } = useRouteMatch();

    const columns = useMemo(() => ([
        { Header: "Submitted", accessor: row => row.created_on.replace(/T/g, ' ').replace(/Z/g, '') },
        { Header: "Assignee", accessor: "assignee_name" },
        { Header: "Description", accessor: "description" },
        {
            Header: "Attachments", accessor: row => <div>
                {row.attachment_1 ? <img src={row.attachment_1} alt="attachment_1" height={40} style={{
                    marginRight: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        setImage(row.attachment_1);
                        setModal(true);
                    }}
                /> : null}
                {row.attachment_2 ? <img src={row.attachment_2} alt="attachment_2" height={40} style={{
                    marginRight: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        setImage(row.attachment_2);
                        setModal(true);
                    }}
                /> : null}
                {row.attachment_3 ? <img src={row.attachment_3} alt="attachment_3" height={40} style={{
                    marginRight: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        setImage(row.attachment_3);
                        setModal(true);
                    }}
                /> : null}
                {row.attachment_4 ? <img src={row.attachment_4} alt="attachment_4" height={40} style={{
                    marginRight: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        setImage(row.attachment_4);
                        setModal(true);
                    }}
                /> : null}
                {row.attachment_5 ? <img src={row.attachment_5} alt="attachment_5" height={40} style={{
                    marginRight: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        setImage(row.attachment_5);
                        setModal(true);
                    }}
                /> : null}
            </div>
        },
    ]), [])

    console.log(selected);
    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                }} />
            </Modal>
            <div className="Container">
                <div className="Details" style={{
                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                    value={el === "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                            />
                         )
                    }
                </div>
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <p style={{
                    fontWeight: 'bold',
                    marginBottom: 12,
                }}>Task Reports</p>
                <Table
                    columns={columns}
                    data={selected.task_reports}
                    loading={false}
                    pageCount={1}
                    fetchData={() => { }}
                    filters={[]}
                    actions={[]}
                />
            </div>
        </div>
    )
}

export default Component;
