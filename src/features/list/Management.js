import React, { useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getManagement, deleteMultipleManagement, deleteManagement, setSelected } from '../slices/management';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Link from '../../components/Link';
import Management from '../../components/cells/Management';

import TemplateWithSelection from './components/TemplateWithSelection';

const columns = [
    // { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => <Management id={row.id} data={row} /> },
    { Header: "Legal Name", accessor: "name_legal" },
    { Header: "Phone", accessor: "phone" },
    // { Header: "Email", accessor: "email" },
    { Header: "Website", accessor: row => <Link>{row.website}</Link> },
]

function Component({ view }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const [ multiActionRows, setMultiActionRows ] = useState([]);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    return (
        <>
        <Modal
            isOpen={confirmDelete}
            disableHeader={true}
            onClick={
                () => {
                    const data = multiActionRows.map(el => el.id)
                    console.log(data);
                    dispatch(deleteMultipleManagement(data, history))
                    setMultiActionRows([]);
                    setConfirmDelete(false);
                }
            }
            toggle={() => {
                setConfirmDelete(false);
                setMultiActionRows([]);
            }}
            okLabel={"Delete"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to delete these managements?
            <p style={{ paddingTop: '10px' }}><ul>
                {multiActionRows.map(el => 
                    <li>{el.name}</li>
                )}
            </ul></p>
        </Modal>
        <TemplateWithSelection
            view={view}
            columns={columns}
            slice="management"
            getAction={getManagement}
            deleteAction={deleteManagement}
            selectAction={(selectedRows) => {
                setMultiActionRows(selectedRows);
            }}
            renderActions={view ? null : (selectedRowIds, page) => {
                return ([
                    <>{Object.keys(selectedRowIds).length > 0 &&
                    <Button color="Danger"
                        onClick={() => {
                            console.log(selectedRowIds);
                            setConfirmDelete(true);
                        }}
                        label="Delete"
                    />}</>,
                    <Button key="Add" label="Add" icon={<FiPlus />}
                        onClick={() => {
                            dispatch(setSelected({}));
                            history.push(url + "/add")
                        }}
                    />
                ])
            }}
        />
        </>
    )
}

export default Component;
