import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiTrash } from 'react-icons/fi';

import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import Form from '../../../../components/Form';
import Input from '../../../../components/Input';
import { getAdsSchedule, deleteAdsSchedule, createAdsSchedule } from '../../../slices/ads';
import { daysLabel, days } from '../../../../utils';
import { setConfirmDelete } from '../../../slice';

const columns = [
    { Header: "Day", accessor: row => days[row.day - 1] },
    { Header: "Hour From", accessor: "hour_from" },
    { Header: "Hour To", accessor: "hour_to" },
]

function Component() {
    const [addSchedule, setAddSchedule] = useState(false);
    const [allDay, setAllDay] = useState(false);

    const { selected, loading, schedule, refreshToggle } = useSelector(state => state.ads);

    let dispatch = useDispatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        dispatch(getAdsSchedule(pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle]);


    return (
        <div>
            <Modal isOpen={addSchedule} disableFooter={true} toggle={() => setAddSchedule(false)}>
                Add Schedule
                <Form
                    noContainer={true}
                    onSubmit={data => {
                        if (allDay) {
                            data.hour_from = '00:00:00';
                            data.hour_to = '23:59:59';
                        }
                        dispatch(createAdsSchedule({ ...data, adv_id: selected.id }))
                        setAddSchedule(false);
                    }}
                >
                    <Input label="Day" type="select" options={daysLabel} />
                    <div class="form-check mt-4">
                        <input type="checkbox" class="form-check-input" id="all-day" value={allDay} onChange={e => setAllDay(e.target.checked)} />
                        <label class="form-check-label m-0 cursor-pointer" for="all-day"><strong>All Day</strong></label>
                    </div>
                    <Input disabled={allDay} label="Hour From" type="time" />
                    <Input disabled={allDay} label="Hour To" type="time" />
                </Form>
            </Modal>
            <Table
                noContainer={true}
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
                onClickDelete={row =>
                    dispatch(setConfirmDelete("Are you sure to delete this item?",
                        () => dispatch(deleteAdsSchedule(row))
                    ))
                }
            />
        </div>
    )
}

export default Component;
