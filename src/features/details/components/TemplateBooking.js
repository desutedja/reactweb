import React, { useState } from 'react';
import {
    FiGlobe,
    FiPhone,
    FiMail,
    FiCheckCircle
} from 'react-icons/fi';
import {
    RiCheckboxLine,
    RiCheckLine,
    RiLightbulbLine,
    RiStore2Line,
} from "react-icons/ri";

import Loading from '../../../components/Loading';
import Tab from '../../../components/Tab';
import Breadcrumb2 from '../../../components/Breadcrumb2';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import TwoColumn from '../../../components/TwoColumn';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { FaCheckCircle } from 'react-icons/fa';

function Component({image, title, website, phone, merchant, transparent=false,
    email, labels, contents, activeTab, pagetitle= '',  imageTitle = '', loading = true }) {

    const [imgLoading, setImgLoading] = useState(true);

    return (
        <>
        <h2 style={{ marginLeft: '16px' }}>{pagetitle}</h2>
        <Breadcrumb2 title={title ? title : 'Details'} />
        <Loading loading={loading}>
                <Column style={{ width: "100%" }}>
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        overflow: 'hidden',
                    }}>
                        <div className={ transparent ? "Container-transparent" : "Container-dashboard-ns" } 
                        style={{
                            flex: 1,
                            width: "100%",
                            overflow: "auto",
                            borderRadius: 10
                        }}>
                            {contents}
                        </div>
                        <Row style={{
                            maxWidth: 360,
                            maxHeight:170,
                            borderRadius: 10
                        }}>
                        <Column style={{ flex: "6", display: "block" }}>
                        <Card style={{ marginLeft: "20px", marginBottom: "20px", borderRadius: 10, border: 0 }}>
                            <CardHeader style={{ background: "transparent", fontSize: 16 }}>
                                <TwoColumn
                                    first={
                                        <>
                                        <div style={{ fontWeight: 700, marginTop: 8}}>
                                            Status
                                        </div>
                                        <div style={{ fontWeight: 700, color: "#FFC200", marginTop: 8, marginBottom: 8 }}>
                                            Booked
                                        </div>
                                        </>
                                    }
                                    second={
                                        <>
                                    <div style={{ fontWeight: 400, marginTop: 8, color: "#E12029"}}>
                                        See History 
                                    </div>
                                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                                        &nbsp;
                                    </div>
                                    </>
                                    }
                                />
                            </CardHeader>
                            <CardBody style={{ fontSize: 12 }}>
                                <div className="card" style={{ padding: 15, border: 0, borderRadius: 10, background: "#F0F6FF"}}>
                                    <p style={{ color: "#244091", fontWeight: 700 }}><FaCheckCircle /> Booking Success</p>
                                    <p style={{ color: "#244091", fontWeight: 400, paddingLeft: 15}}> Residents need to scan QR while in this facility.</p>
                                </div>
                            </CardBody>
                        </Card>
                        <Card style={{ marginLeft: "20px", marginBottom: "20px", borderRadius: 10, border: 0 }}>
                            <CardBody style={{ fontSize: 12 }}>
                                    {imgLoading &&
                                        <div style={{
                                            maxHeight: 300,
                                            objectFit: 'cover',
                                            width: '100%',
                                            marginBottom: 16,
                                        }} className="shine" />
                                    }
                                    <img
                                        alt="Avatar"
                                        src={image && image !== "placeholder" ? image :
                                            require('../../../assets/fallback.jpg')}
                                        style={{
                                            maxHeight: imgLoading ? 0 : 300,
                                            objectFit: 'cover',
                                            width: '100%',
                                            marginBottom: 16,
                                            borderRadius: 6,
                                        }}
                                        onLoad={() => setImgLoading(false)}
                                        onError={() => setImgLoading(false)}
                                    />
                                    <TwoColumn
                                        first={
                                            title && <div style={{
                                                marginBottom: 4, fontSize: "16px", fontWeight: 700
                                            }}>Yipy Gym</div>
                                        }
                                        second={
                                            phone && 
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}>
                                                Qty: 1
                                            </div>
                                        }
                                    />
                                    {/* {title && <div style={{
                                        marginBottom: 4, fontSize: "16px", fontWeight: 700
                                    }}>Yipy Gym</div>}
                                    {phone && <div className="row">
                                        <div className="col d-flex" style={{ fontSize: "14px", fontWeight: 400 }}>
                                            Qty: 1
                                        </div>
                                    </div>} */}
                            </CardBody>
                        </Card>
                        </Column>
                        </Row>
                    {/* <Row>
                        <Column>
                        <TwoColumn
                            first={
                                <div>
                                    <b>Status</b>
                                </div>
                            }
                            second={
                            <div>
                                <b>See History</b>
                            </div>
                            }
                        />
                        </Column>
                    </Row> */}
                </div>
            </Column>
        </Loading>
        </>
    )
}

export default Component;
