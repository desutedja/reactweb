import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiTrash } from 'react-icons/fi';

import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import Form from '../../../../components/Form';
import Input from '../../../../components/Input';
import { getAdsSchedule, deleteAdsSchedule, createAdsSchedule } from '../../../slices/ads';

const days = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
    { value: 6, label: "Sabtu" },
    { value: 7, label: "Minggu" },
]

const columns = [
    { Header: "Day", accessor: row => days.find(el => el.value === row.day)?.label },
    { Header: "Hour From", accessor: "hour_from" },
    { Header: "Hour To", accessor: "hour_to" },
]

function Component() {
    const [addSchedule, setAddSchedule] = useState(false);


    const { selected, loading, schedule, refreshToggle } = useSelector(state => state.ads);

    let dispatch = useDispatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
       dispatch(getAdsSchedule(pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle]);

    return (
        <div>
            <Modal isOpen={addSchedule} toggle={() => setAddSchedule(false)}>
                Add Schedule
                <Form
                    onSubmit={data => {
                        dispatch(createAdsSchedule({ ...data, adv_id: selected.id }))
                        setAddSchedule(false);
                    }}
                >
                    <Input label="Day" type="select" options={days} />
                    <Input label="Hour From" type="time" />
                    <Input label="Hour To" type="time" />
                </Form>
            </Modal>
            <Table
                columns={columns}
                data={schedule.items}
                loading={loading}
                pageCount={schedule.total_pages}
                fetchData={fetchData}
                filters={[]}
                actions={[
                    <Button key="Add" label="Add" icon={<FiPlus />}
                        onClick={() => setAddSchedule(true)}
                    />
                ]}
                renderActions={(selectedRowIds, page) => {
                    // console.log(selectedRowIds, page);
                    return ([
                        <Button color="danger"
                            disabled={Object.keys(selectedRowIds).length === 0}
                            onClick={() => {
                                Object.keys(selectedRowIds).map(el => dispatch(deleteAdsSchedule(
                                    page[el].original)));
                            }}
                            icon={<FiTrash />}
                            label="Delete"
                        />,
                    ])
                }}
                onClickDelete={row => dispatch(deleteAdsSchedule(row,))}
            />
        </div>
    )
}

export default Component;