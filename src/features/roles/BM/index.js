import React, { useEffect, useState } from 'react';
import {
    FiEdit, FiUsers, FiZap, FiVolume2,
    FiBarChart2, FiPlus
} from "react-icons/fi";
import {
    RiTaskLine,
    RiBuilding2Line, RiCustomerService2Line,
    RiAdvertisementLine,
} from "react-icons/ri";
import { Redirect, Route } from 'react-router-dom';

import Template from '../components/Template';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Table from '../../../components/Table';
import Tab from '../../../components/Tab';
import { useSelector, useDispatch } from 'react-redux';

import { endpointAdmin, endpointManagement, toSentenceCase } from '../../../settings';
import { get, setConfirmDelete } from '../../slice';
import { setSelected, editBuildingManagement } from '../../slices/building';

import Dashboard from './Dashboard';
import Ads from './Ads';
import Announcement from './Announcement';
import Billing from './Billing';
import Building from './Building';
import Resident from './Resident';
import Staff from './Staff';
import Task from './Task';
import Details from '../../details/components/Detail';
import Chat from '../../chat';

const columns = [
    { Header: 'ID', accessor: row => row.id },
    { Header: 'Department Name', accessor: row => row.department_name },
];

const modules = [
    {
        icon: <FiBarChart2 className="MenuItem-icon" />,
        label: "Dashboard",
        path: "/dashboard",
        subpaths: [
            '/building',
            '/task',
            '/advertisement',
        ],
        component: <Dashboard />,
    },
    {
        icon: <RiBuilding2Line className="MenuItem-icon" />,
        label: "Building",
        path: "/building",
        component: <Building />,
    },
    {
        icon: <FiUsers className="MenuItem-icon" />,
        label: "Resident",
        path: "/resident",
        component: <Resident />,
    },
    {
        icon: <FiZap className="MenuItem-icon" />,
        label: "Billing",
        path: "/billing",
        subpaths: [
            '/unit',
            '/settlement'
        ],
        component: <Billing />,
    },
    {
        icon: <RiCustomerService2Line className="MenuItem-icon" />,
        label: "Staff",
        path: "/staff",
        component: <Staff />,
    },
    {
        icon: <RiTaskLine className="MenuItem-icon" />,
        label: "Task",
        path: "/task",
        component: <Task />,
    },
    {
        icon: <RiAdvertisementLine className="MenuItem-icon" />,
        label: "Advertisement",
        path: "/advertisement",
        component: <Ads />,
    },
    {
        icon: <FiVolume2 className="MenuItem-icon" />,
        label: "Announcement",
        path: "/announcement",
        component: <Announcement />,
    },
];

const labels = {
    'Information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'email'],
    'Address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
    'Others': ['max_units', 'max_floors', 'max_sections'],
}
const picBmLabels = {
    'Fees': ['billing_published', 'billing_duedate', 'penalty_fee']
}

export default () => {
    const dispatch = useDispatch();
    const { auth, building } = useSelector(state => state);
    const id = auth.user.building_id;
    const { blacklist_modules } = useSelector(state => state.auth.user);

    const [departments, setDepartments] = useState([]);
    const [data, setData] = useState({})
    const [dataBM, setDataBM] = useState({})
    const [menus, setMenus] = useState(modules || []);

    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/department',
        res => {
            setDepartments(res.data.data);
            console.log(res.data.data)
        }
        ))
    }, [dispatch])

    useEffect(() => {
        const modulesLabel = blacklist_modules?.map(module => module.module);
        const modulesFilter = menus.filter(menu => {
            const truthy = modulesLabel?.some(label => label === menu.label.toLowerCase())
            return !truthy
        })
        setMenus(modulesFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blacklist_modules])

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/details/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [dispatch, id, building.refreshToggle])

    useEffect(() => {
        dispatch(get(endpointAdmin + '/management/building/details/' + auth.user.building_management_id,
            res => {
                setDataBM(res.data.data)
            },
            err => {
                console.log('ERR', err)
            }
        ))
    }, [auth.user.building_management_id, dispatch, building.refreshToggle])

    return (
        <Template role="bm">
            <Redirect exact from={"/bm"} to={"/bm" + menus[0].path} />
            {menus.map(el => <Route
                key={el.label}
                label={el.label}
                icon={el.icon}
                path={"/bm" + el.path}
                subpaths={el.subpaths}
            >
                {el.component}
            </Route>)}
            <Route path={"/bm/chat"}>
                <Chat />
            </Route>
            <Route path={"/bm/settings"}>
                <div className="Container flex-column pr-3">
                    <Tab
                        labels={['General', 'Departements']}
                        contents={[
                            <>
                                <div className="scroller-y pr-4">
                                    <Details editPath="building/edit" labels={labels} data={data} />
                                    <FeesSetting
                                    labels={picBmLabels}
                                    data={dataBM}
                                    />
                                </div>
                            </>,
                            <>
                                <Table
                                    expander={false}
                                    noSearch={true}
                                    pagination={false}
                                    columns={columns}
                                    data={departments}
                                    onClickDelete={ row => {
                                        // dispatch(setConfirmDelete("Are you sure to delete this item?", () => {
                                        //     dispatch(del(endpointMerchant + '/admin/categories/' + row.id,
                                        //     res => {
                                        //         dispatch(setInfo({
                                        //             color: 'success',
                                        //             message: 'Item has been deleted.'
                                        //         }))
                                        //     }))
                                        //     setRefresh(!refresh);
                                        // }))
                                    }}
                                    onClickEdit={row => {
                                        // setCategoryData(row);
                                        // setModalCategory(true);
                                        // setTitle('Edit Category');
                                    }}
                                    renderActions={() => [
                                        <Button key="Add Department" label="Add Department" icon={<FiPlus />}
                                            onClick={() => {
                                                // setModalCategory(true);
                                                // setTitle('Add Category');
                                            }}
                                        />
                                    ]}
                                />
                            </>
                        ]}
                    />
                </div>
            </Route>
        </Template>
    )
}

const dateArray = (() => {
    const array = Array(31).fill({});

    return array.map((el, index) => ({
        label: index + 1 + '',
        value: index + 1 + '',
    }))
})()

const FeesSetting = ({data, labels}) => {
    const {auth} = useSelector(state => state);
    const [modalFees, setModalFees] = useState(false);
    
    const dispatch = useDispatch();

    return (
        <>
            <Modal
            disableFooter={true}
            isOpen={modalFees}
            title="Edit Fees"
            toggle={() => setModalFees(false)}
            >
                <Form
                    noContainer={true}
                    showCancel={true}
                    onCancel={() => {
                        setModalFees(false)
                    }}
                    onSubmit={dataRef => {
                        const finalData = {
                            building_id: auth.user.building_id,
                            management_id: auth.user.management_id,
                            ...dataRef
                        }
                        dispatch(editBuildingManagement(finalData, data.id))
                        setModalFees(false)
                    }}>
                    <Input label="Billing Published (Date)" name="billing_published" type="select"
                        options={dateArray}
                        inputValue={data.billing_published}
                    />
                    <Input label="Billing Due (Date)" name="billing_duedate" type="select"
                        options={dateArray}
                        inputValue={data.billing_duedate} />
                    <Input label="Penalty Fee" type="number" addons="%"
                        inputValue={data.penalty_fee} />
                </Form>
            </Modal>
            <div className="row mt-4">
                <div className="col">
                    {Object.keys(labels).map((group, i) =>
                        <div key={i} style={{
                            marginBottom: 16,
                            marginRight: 30,
                        }}>
                            <div style={{
                                color: 'grey',
                                borderBottom: '1px solid silver',
                                width: 200,
                                marginBottom: 8,
                                marginLeft: 4
                            }}
                            >
                                {group}
                            </div>
                            {labels[group].map((el, i) => {
                                return !el.disabled ?
                                    <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                        <div className="col-auto" flex={3} style={{
                                            fontWeight: 'bold',
                                            textAlign: 'left',
                                            minWidth: 200,
                                            textTransform: 'capitalize'
                                        }}>
                                            {el.replace('_', ' ')}
                                        </div>
                                        <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                            {el === 'penalty_fee' ? (data[el] + ' %') : ('Day ' + data[el])}
                                        </div>
                                    </div> : null;
                            })}
                        </div>
                    )}
                </div>
                <div className="col-auto d-flex flex-column">
                    <Button icon={<FiEdit />} label="Edit"
                    onClick={() => {
                        setModalFees(true);
                    }}
                    />
                </div>
            </div>
        </>
    )
}
