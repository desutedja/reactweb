import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get } from '../slice';

import { endpointAdmin } from '../../settings';
import Breadcrumb from '../../components/Breadcrumb';
import Loading from '../../components/Loading';
import PGFee from './PGFee';
import AdminFee from './AdminFee';

// additional: "phone"
// by: "midtrans"
// category: "E-Wallet"
// created_on: "2020-05-02T04:08:55Z"
// deleted: 0
// fee: 0
// fee_type: "percentage"
// icon: "https://centratama.okbabe.technology/clink-assets/asset-storage/img/2e2ad8b73325a0b2c87c5dcd7e29daad-1593000511.png"
// id: 1
// markup_fee: 0
// modified_on: "2020-06-24T12:57:06Z"
// name: "GoPay"
// percentage: 2
// provider: "gopay"
// sequence: 2
// type: "e_wallet"

function Settings() {
    const [data, setData] = useState({});
    const [id, setID] = useState({});
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
                setPG(true);
            }}>Change</button>
        </div>
    }

    return (
        <>
            <PGFee id={id} toggleRefresh={toggle} modal={pg} toggleModal={() => setPG(false)} />
            <AdminFee toggleRefresh={toggle} modal={admin} toggleModal={() => setAdmin(false)} />
            <Breadcrumb />
            <Loading loading={loading}>
                <div className="Container" style={{
                    flexDirection: 'column'
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
            </Loading>
        </>
    )
}

export default Settings;