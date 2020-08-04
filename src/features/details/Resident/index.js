import React, { useState, useEffect } from 'react';
import {
    useDispatch,
} from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Modal from '../../../components/Modal';

import Unit from './contents/Unit';
import { useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { endpointResident } from '../../../settings';
import { deleteResident, setSelected } from '../../slices/resident';

const details = {
    'Profile': ['created_on', 'gender', 'birthplace', 'birth_date', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Bank Account': ['account_name', 'account_no', 'account_bank'],
};

function Component({ view }) {
    const [data, setData] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);

    let dispatch = useDispatch();
    let { id } = useParams();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointResident + '/management/resident/detail/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [dispatch, id])

    return (
        <>
        <Modal 
            isOpen={confirmDelete}
            disableHeader={true}
            onClick={
              () =>  dispatch(deleteResident(data, history))
            }
            toggle={() => setConfirmDelete(false)}
            okLabel={"Delete"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to delete resident <b>{data.firstname + " " + data.lastname}</b>?
        </Modal>
        <Template
            image={data.photo || "placeholder"}
            title={data.firstname + ' ' + data.lastname}
            email={data.email}
            phone={data.phone}
            loading={!data.id}
            labels={["Details", "Unit"]}
            activeTab={0}
            contents={[
                <Detail view data={data} labels={details}
                    onDelete={() => setConfirmDelete(true) }
                />,
                <Unit view id={id} />,
            ]}
        />
        </>
    )
}

export default Component;
