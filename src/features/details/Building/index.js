import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Modal from '../../../components/Modal';
import Unit from './contents/Unit';
import UnitType from './contents/UnitType';
import Section from './contents/Section';
import Service from './contents/Service';
import Management from './contents/Management';
import Module from './contents/Module';
import { endpointAdmin } from '../../../settings';
import { useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { setSelected, deleteBuilding } from '../../slices/building';

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}

const tabs = ["Details", "Section", "Unit Type", "Unit", "Service", "Management", "Module"];
const tabsBM = ["Section", "Unit Type", "Unit", "Billing Service"];

function Component({ view }) {
    const [data, setData] = useState({});
    const { auth } = useSelector(state => state)

    const [confirmDelete, setConfirmDelete] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();
    let { id } = useParams();

    const contents = [
        <Detail view={view} data={data} labels={labels}
            onDelete={
                () => setConfirmDelete(true)
            }
        />,
        <Section view={view} />,
        <UnitType view={view} />,
        <Unit view={view} />,
        <Service view={view} />,
        <Management view={view} />,
        <Module view={view} />
    ];
    const contentsBM = [
        <Section />,
        <UnitType />,
        <Unit />,
        <Service />,
    ];

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/details/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [id, dispatch])

    return (
        <>
            <Modal
                isOpen={confirmDelete}
                disableHeader={true}
                onClick={
                    () => dispatch(deleteBuilding(data, history))
                }
                toggle={() => setConfirmDelete(false)}
                okLabel={"Delete"}
                cancelLabel={"Cancel"}
            >
                Are you sure you want to delete building <b>{data.name}</b>?
            </Modal>
            <Template
                activeTab={history.location.state ? history.location.state.tab : 0}
                image={auth.role === "sa" && data.logo}
                title={data.name}
                website={data.website}
                phone={data.phone}
                loading={!data.id}
                labels={auth.role === 'sa' ? tabs : tabsBM}
                contents={auth.role === 'sa' ? contents : contentsBM}
            />
        </>
    )
}

export default Component;
