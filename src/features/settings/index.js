import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get } from '../slice';

import { endpointAdmin } from '../../settings';
import Breadcrumb from '../../components/Breadcrumb';
import Loading from '../../components/Loading';
import PGFee from './PGFee';
import AdminFee from './AdminFee';

function Settings() {
    const [data, setData] = useState({});
    const [id, setID] = useState({});
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const [pg, setPG] = useState(false);
    const [admin, setAdmin] = useState(false);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(get(endpointAdmin + '/centratama/config', res => {
            setData(res.data.data);
            setLoading(false);
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

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
            }}>Change</button>
        </div>
    }

    return (
        <>
            <PGFee id={id} title={title} toggleRefresh={toggle} modal={pg} toggleModal={() => setPG(false)} />
            <AdminFee title={title} toggleRefresh={toggle} modal={admin} toggleModal={() => setAdmin(false)} />
            <Breadcrumb />
            <Loading loading={loading}>
                <div className="Container" style={{
                    flexDirection: 'column'
                }}>
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
                </div>
            </Loading>
        </>
    )
}

export default Settings;