import React, { useState, useCallback } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Link from '../../components/Link';
import Editor from '../../components/Editor';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FiChevronRight, FiX } from 'react-icons/fi';
import { RiCheckDoubleLine, RiCheckLine } from 'react-icons/ri';
import { get } from '../../utils';
import { endpointAdmin } from '../../settings';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner', accessor: 'owner_name' },
    { Header: 'Website', accessor: row => <Link>{row.website}</Link> },
]

const roles = [
    { value: 'centratama', label: 'Centratama' }, 
    { value: 'management', label: 'Management' }, 
    { value: 'staff', label: 'Staff' }, 
    { value: 'staff_courier', label: 'Staff Courier' }, 
    { value: 'staff_security', label: 'Staff Security' }, 
    { value: 'staff_technician', label: 'Staff Technician' }, 
    { value: 'resident', label: 'Resident' }, 
    { value: 'merchant', label: 'Merchant' },
]

const topics = [
    {value: 'emergency', label: 'Emergency'},
    {value: 'transaction', label: 'Transaction'},
    {value: 'task', label: 'Task'},
    {value: 'billing', label: 'Billing'},
    {value: 'announcement', label: 'Announcement'},
]

function Component() {
    const [modal, setModal] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [buildingsSelected, setBuildingsSelected] = useState([]);
    const [buildingsPageCount, setBuildingsPageCount] = useState(1);
    const [buildingsLoading, setBuildingsLoading] = useState(false);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <p className="Title" style={{
                    marginBottom: 16
                }}>Select Building</p>
                <Table
                    columns={columns}
                    data={buildings}
                    loading={buildingsLoading}
                    pageCount={buildingsPageCount}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        setBuildingsLoading(true);
                        get(endpointAdmin + '/building' +
                            '?page=' + (pageIndex + 1) +
                            '&search=' + search +
                            '&limit=' + pageSize,
                            headers,
                            res => {
                                const { items, total_pages } = res.data.data;
                                setBuildings(items);
                                setBuildingsPageCount(total_pages);

                                setBuildingsLoading(false);
                            });
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [headers])}
                    renderActions={(selectedRowIds, page) => {
                        // console.log(selectedRowIds, page);
                        return ([
                            <Button
                                disabled={Object.keys(selectedRowIds).length === 0}
                                key="Select"
                                label="Select"
                                icon={<RiCheckLine />}
                                onClick={() => {
                                    let selectedBuildings =
                                        page.filter(el => Object.keys(selectedRowIds).includes(el.id))
                                            .map(el => el.original);

                                    console.log(selectedBuildings);
                                    setBuildingsSelected(selectedBuildings);
                                    setModal(false);
                                }}
                            />,
                            <Button key="Select All" label="Select All" icon={<RiCheckDoubleLine />}
                                onClick={() => {
                                    let selectedBuildings =
                                        page.map(el => el.original);

                                    console.log(selectedBuildings);
                                    setBuildingsSelected(selectedBuildings);
                                    setModal(false);
                                }}
                            />,
                        ])
                    }}
                />
            </Modal>
            <Form
                onSubmit={data => { }}
                // selected.id ?
                // dispatch(editName(headers, data, history, selected.id))
                // :
                // dispatch(createName(headers, data, history))}
                loading={loading}
            >
                <Input label="Title" />
                <Input label="Topic" type="select" options={topics} />
                <Input label="Building" hidden inputValue={JSON.stringify(buildingsSelected.map(el =>
                    el.id
                ))} />
                <Input label="Select Building"
                    actionlabels={
                        buildingsSelected.length > 0 ? {"Deselect All": () => setBuildingsSelected([]) } : {}
                    }
                    type="multiselect"
                    icon={<FiChevronRight />}
                    onClick={() => setModal(true)}
                    inputValue={buildingsSelected.map(el => ({
                        value: el.name,
                        onClickDelete: () => {
                            setBuildingsSelected(buildingsSelected.filter(el2 => el2.id !== el.id))
                        }
                    }))} />
                <Input label="Consumer Role" type="select" options={roles} />
                {/* <Input label="Consumer ID" /> */}
                <Input label="Image" type="file" />
                <Editor label="Description" />
            </Form>
        </div>
    )
}

export default Component;
