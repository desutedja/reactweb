import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get, del, setConfirmDelete, setInfo } from '../slice';
import { FiPlus } from 'react-icons/fi'

import { endpointAdmin, endpointMerchant } from '../../settings';
import { toSentenceCase } from '../../utils';
import Breadcrumb from '../../components/Breadcrumb';
import Loading from '../../components/Loading';
import PGFee from './PGFee';
import AdminFee from './AdminFee';
import Tab from '../../components/Tab';
import Table from '../../components/Table';
import CellCategory from '../../components/cells/Category';
import ModalCategory from './Category';
import Button from '../../components/Button';

const columns = [
    { Header: 'Icon', accessor: row => <CellCategory data={row} /> },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) }
]

function Settings() {
    const [data, setData] = useState({});
    const [id, setID] = useState({});
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const [pg, setPG] = useState(false);
    const [pgData, setPGData] = useState({});
    const [admin, setAdmin] = useState(false);
    const [adminData, setAdminData] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [modalCategory, setModalCategory] = useState(false);

    let dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        dispatch(get(endpointAdmin + '/centratama/config', res => {
            setData(res.data.data);
            setLoading(false);
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useEffect(() => {
        setLoading(true)
        dispatch(get(endpointMerchant + '/admin/categories',
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

    const toggle = () => {
        setRefresh(!refresh);
    }

    const Item = ({ data }) => {
        return <div className="Settings-item">
            <div style={{
                flex: 1
            }}>
                <p style={{
                    fontWeight: 'bold',
                    marginRight: 8,
                }}>{data.name}</p>
                <p style={{
                    marginRight: 16,
                }}>{data.category}</p>
            </div>
            <div style={{
                flex: 1,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <p style={{
                        marginRight: 4
                    }}>Fee: </p>
                    {!!data.fee && <p>Rp {data.fee}</p>}

                    {!!data.fee && !!data.percentage && <p style={{
                        marginLeft: 16,
                        marginRight: 16,
                    }}>+</p>}
                    {!!data.percentage && <p>{data.percentage} %</p>}
                    {!data.fee && !data.percentage && <p style={{
                        color: 'grey'
                    }}>None</p>}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <p style={{
                        marginRight: 4
                    }}>Markup: </p>
                    {!!data.markup_fee ? <p>{data.markup_fee} %</p>
                        : <p style={{
                            color: 'grey'
                        }}>None</p>}
                </div>
            </div>
            <button onClick={() => {
                setID(data.id);
                setTitle(data.name);
                setPG(true);
                setPGData(data);
            }}>Change</button>
        </div>
    }

    return (
        <>
            <PGFee
                id={id}
                title={title}
                toggleRefresh={toggle}
                modal={pg}
                toggleModal={() => setPG(false)}
                data={pgData}
            />
            <AdminFee
                title={title}
                toggleRefresh={toggle}
                modal={admin}
                toggleModal={() => setAdmin(false)}
                data={adminData}
            />
            <Breadcrumb />
            <div className="Container">
                <Tab
                labels={['Fees', 'Categories']}
                contents={[
                <>
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}>
                        <div className="Settings-item" style={{
                            marginBottom: 16,
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <p style={{
                                    fontWeight: 'bold',
                                    marginRight: 8,
                                }}>Admin Fee</p>
                                <p style={{
                                    marginRight: 16,
                                }}>{data.admin_fee} %</p>
                            </div>
                            <button onClick={() => {
                                setAdmin(true);
                                setAdminData(data.admin_fee);
                                setTitle('Admin Fee');
                            }}>Change</button>
                        </div>
                        <p style={{
                            fontWeight: 'bold',
                            marginRight: 8,
                            marginBottom: 8,
                            paddingLeft: 8,
                            fontSize: '1.2rem',
                        }}>PG Fee</p>
                        {data.id && data.payment_gateway_methods.map(el => {
                            return <Item key={el.id} data={el} />
                        })}
                    </div>
                    <Loading loading={loading} />
                </>,
                <>        
                    <ModalCategory
                        title={title}
                        toggleRefresh={toggle}
                        modal={modalCategory}
                        toggleModal={() => setModalCategory(false)}
                        data={categoryData}
                    />
                    <Table
                        expander={false}
                        noSearch={true}
                        pagination={false}
                        columns={columns}
                        data={categories}
                        onClickDelete={ row => {
                            dispatch(setConfirmDelete("Are you sure to delete this item?", () => {
                                dispatch(del(endpointMerchant + '/admin/categories/' + row.id))
                                dispatch(setInfo({
                                    color: 'success',
                                    message: 'Item has been deleted.'
                                }))
                                setRefresh(!refresh);
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
                </>
                ]}/>
            </div>
        </>
    )
}

export default Settings;