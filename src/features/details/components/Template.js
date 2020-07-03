import React, { useState } from 'react';
import { FiGlobe, FiPhone, FiHome, FiMail } from 'react-icons/fi';

import Container from '../../../components/Container';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Tab from '../../../components/Tab';
import Breadcrumb from '../../../components/Breadcrumb';

function Component({ image, title, website, phone, merchant,
    email, labels, contents }) {

    const [imgLoading, setImgLoading] = useState(true);

    return (
        <>
            <Breadcrumb title="Details" />
            <div className="d-flex flex-wrap">
                {(image || title) && <div className="col-12 col-md-5 col-lg-4 col-xl-3 box-self">
                        <div className="row">
                            <div className="col">
                                {imgLoading &&
                                    <div style={{
                                        height: 400,
                                        objectFit: 'cover',
                                        width: '100%',
                                        marginBottom: 16,
                                    }} className="shine" />
                                }
                                <img
                                    alt="Avatar"
                                    src={image ? image :
                                        require('../../../assets/fallback.jpg')}
                                    style={{
                                        height: imgLoading ? 0 : 400,
                                        objectFit: 'cover',
                                        width: '100%',
                                        marginBottom: 16,
                                    }}
                                    onLoad={() => setImgLoading(false)}
                                />
                                {title && <h3 style={{
                                    marginBottom: 16,
                                }}>{title}</h3>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {website && <div className="row">
                                    <div className="col d-flex">
                                        <FiGlobe
                                        className="mr-3 h4"
                                        // style={{
                                            // marginRight: 8,
                                            // fontSize: '1.2rem',
                                        // }}
                                        />
                                        <h5><a href={website}>{website}</a></h5>
                                    </div>
                                </div>}
                                {email && <div className="row">
                                    <div className="col d-flex">
                                        <FiMail
                                        className="mr-3 h4"
                                        // style={{
                                            // marginRight: 8,
                                            // fontSize: '1.2rem',
                                        // }}
                                        />
                                        <h5><a href={"mailto:" + email}>{email}</a></h5>
                                    </div>
                                </div>}
                                {phone && <div className="row">
                                    <div className="col d-flex">
                                        <FiPhone
                                        className="mr-3 h4"
                                        // style={{
                                            // marginRight: 8,
                                            // fontSize: '1.2rem',
                                        // }}
                                        />
                                        <h5>{phone}</h5>
                                    </div>
                                </div>}
                                {merchant && <div className="row">
                                    <div className="col d-flex">
                                        <FiHome
                                        className="mr-3 h4"
                                        // style={{
                                            // marginRight: 8,
                                            // fontSize: '1.2rem',
                                        // }}
                                        />
                                        <h5>{merchant}</h5>
                                    </div>
                                </div>}
                            </div>
                        </div>
                </div>}
                <div className="col-12 col-md box-self ml-0 mt-4 ml-md-4 mt-md-0">
                    <Tab
                        labels={labels}
                        contents={contents}
                    />
                </div>
            </div>
        </>
    )
}

export default Component;
