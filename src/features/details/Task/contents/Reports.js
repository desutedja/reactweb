import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const { selected } = useSelector(state => state.task);

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

    return (
        <>
            <Modal disableFooter disableHeader isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                }} />
            </Modal>
            <Table
                noContainer={true}
                columns={columns}
                data={selected.task_reports}
                loading={false}
                pageCount={1}
                fetchData={() => { }}
                filters={[]}
                actions={[]}
            />
        </>
    )
}

export default Component;
