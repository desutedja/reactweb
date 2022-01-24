import React, { useState } from 'react';
import {
    FiGlobe,
    FiPhone,
    FiMail
} from 'react-icons/fi';
import {
    RiStore2Line,
} from "react-icons/ri";

import Loading from '../../../components/Loading';
import Tab from '../../../components/Tab';
import Breadcrumb from '../../../components/Breadcrumb';

function Component({image, title, website, phone, merchant, transparent, reason=false,
    email, labels, contents, activeTab, pagetitle= '',  imageTitle = '', loading = true }) {

    const [imgLoading, setImgLoading] = useState(true);

    return (
        <>
        <h2 style={{ marginLeft: '16px' }}>{pagetitle}</h2>
        <Breadcrumb title={title ? title : 'Details'} />
        <Loading loading={loading}>
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
            }}>
                <div className='column'>
                {(image) && <div className="Container" style={{
                    flexDirection: 'column',
                    maxWidth: 360,
                }}>
                    {imgLoading &&
                        <div style={{
                            height: 300,
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
                            height: imgLoading ? 0 : 300,
                            objectFit: 'cover',
                            width: '100%',
                            marginBottom: 16,
                        }}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                    />
                    {title && <h3 style={{
                        marginBottom: 16,
                    }}>{title}</h3>}
                    {website && <div className="row">
                        <div className="col d-flex">
                            <FiGlobe className="mr-3 h4" />
                            <h5><a href={website}>{website}</a></h5>
                        </div>
                    </div>}
                    {email && <div className="row">
                        <div className="col d-flex">
                            <FiMail className="mr-3 h4" />
                            <h5><a href={"mailto:" + email}>{email}</a></h5>
                        </div>
                    </div>}
                    {phone && <div className="row">
                        <div className="col d-flex">
                            <FiPhone className="mr-3 h4" />
                            <h5>{'+' + phone}</h5>
                        </div>
                    </div>}
                    {merchant && <div className="row">
                        <div className="col d-flex">
                            <RiStore2Line className="mr-3 h4" />
                            <h5>{merchant}</h5>
                        </div>
                    </div>}
                </div>}
                {<div className="Container" style={{
                    flexDirection: 'column',
                    maxWidth: 360,
                }}>
                    <div className="row" style={{ borderBottom: '1px solid #E9E9E9', marginBottom: 10 }}>
                        <div className="col">
                            <h5>Last Update</h5>
                        </div>
                        <div className="col">
                            <p style={{ textAlign: 'right', fontSize: '12px' }}><a style={{ color: '#E12029' }} href=''>See history</a></p>
                        </div>
                    </div>
                    {website && <div className="row">
                        <div className="col d-flex">
                            <FiGlobe className="mr-3 h4" />
                            <h5><a href={website}>{website}</a></h5>
                        </div>
                    </div>}
                    <div className="row">
                        <div className="col d-flex">
                            <h5>Edited by</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h6>Dadang Jordan</h6>
                        </div>
                        <div className="col">
                            <p style={{ textAlign: 'right', fontSize: '12px' }}>18 January 2022 12:23</p>
                        </div>
                    </div>
                    <div className="row" style={{ borderBottom: '1px solid #E9E9E9', marginRight: 1, marginLeft: 1, marginBottom: 10 }}>
                    </div>
                    {title && <div className="row">
                        <div className="col d-flex reason-container">
                            <p style={{ fontSize: '12px' }}>Expected to return a value in arrow function expected to return a value</p>
                        </div>
                    </div>}
                </div>}
                </div>
                <div className={ transparent ? "Container-transparent" : "Container" } style={{
                    flex: 2,
                }}>
                    <Tab
                        labels={labels}
                        contents={contents}
                        activeTab={activeTab}
                    />
                </div>
            </div>
        </Loading>
        </>
    )
}

export default Component;
