import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Modal from '../../../components/Modal';
import Detail from '../components/Detail';
import Template from '../components/Template';
import { useHistory, useParams } from 'react-router-dom';
import { endpointAdmin } from '../../../settings';
import { setSelected, deleteManagement } from '../../slices/management';
import { get } from '../../slice';

const details =
{
    'Information': ['id', 'created_on', 'name_legal', 'email'],
    'Contact Person': ['pic_name', 'pic_phone', 'pic_email']
};

function Component({ view }) {
    const [data, setData] = useState({});

    const [confirmDelete, setConfirmDelete] = useState(false);
    
    let dispatch = useDispatch();
    let history = useHistory();
    let { id } = useParams();
    
    useEffect(() => {
        dispatch(get(endpointAdmin + '/management/details/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [id, dispatch])

    return (
        <>
        <Modal 
            isOpen={confirmDelete}
            btnDanger
            disableHeader={true}
            onClick={
              () =>  dispatch(deleteManagement(data, history))
            }
            toggle={() => setConfirmDelete(false)}
            okLabel={"Delete"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to delete management <b>{data.name}</b> ?
        </Modal>
        <Template
            view={view}
            image={data.logo}
            title={data.name}
            website={data.website}
            phone={data.phone}
            loading={!data.id}
            labels={["Details"]}
            contents={[
                <Detail view={view} type="Management" data={data} labels={details}
                    onDelete={
                        () => setConfirmDelete(true)
                    }
                />,
            ]}
        />
        </>
    )
}

export default Component;
