import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get, del, setConfirmDelete, setInfo } from '../slice';
import { FiPlus } from 'react-icons/fi'

import { endpointMerchant } from '../../settings';
import Breadcrumb from '../../components/Breadcrumb';

import Tab from '../../components/Tab';
import Table from '../../components/Table';
import ModalCategory from './Category';
import Button from '../../components/Button';

const columnsMerchantCategories = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Description', accessor: 'description' }
];

function Settings() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const [categories, setCategories] = useState([]);
    const [modalCategory, setModalCategory] = useState(false);
    const [categoryData, setCategoryData] = useState({});

    let dispatch = useDispatch();

    useEffect(() => {
        setLoading(true)
        dispatch(get("http://86.38.203.90:1111/category",
        res => {
            console.log(res.data)
            setCategories(res.data.data);
            setLoading(false);
        },
        err => {
            console.log(err.response);
            setLoading(false);
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    useEffect(() => {
        if (!modalCategory) setCategoryData({});
    }, [modalCategory]);

    const toggle = () => {
        setRefresh(!refresh);
    }

    return (
        <>
            <Breadcrumb />
            <div className="Container">
                <Tab
                labels={['Categories']}
                contents={[
                <>        
                    <ModalCategory
                        title={title}
                        toggleRefresh={toggle}
                        modal={modalCategory}
                        toggleModal={() => setModalCategory(false)}
                        toggleLoading={setLoading}
                        data={categoryData}
                    />
                    <Table
                        expander={false}
                        noSearch={true}
                        pagination={false}
                        loading={loading}
                        columns={columnsMerchantCategories}
                        data={categories}
                        onClickDelete={ row => {
                            dispatch(setConfirmDelete("Are you sure to delete this item?", () => {
                                dispatch(del(endpointMerchant + '/admin/categories/' + row.id,
                                res => {
                                    dispatch(setInfo({
                                        color: 'success',
                                        message: 'Item has been deleted.'
                                    }))
                                    setRefresh(!refresh);
                                }))
                            }))
                        }}
                        onClickEdit={row => {
                            setCategoryData(row);
                            setModalCategory(true);
                            setTitle('Edit Category');
                        }}
                        renderActions={() => [
                            <Button key="Add Category" label="Add Category" icon={<FiPlus />}
                                onClick={() => {
                                    setModalCategory(true);
                                    setTitle('Add Category');
                                }}
                            />
                        ]}
                    />
                </>,
                ]}/>
            </div>
        </>
    )
}

export default Settings;