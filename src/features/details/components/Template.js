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

function Component({ image, title, website, phone, merchant,
    email, labels, contents, activeTab, imageTitle = '', loading = true }) {

    const [imgLoading, setImgLoading] = useState(true);

    return (
        <Loading loading={loading}>
            <Breadcrumb title={title} />
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
            }}>
                {(image || title) && <div className="Container" style={{
                    flexDirection: 'column',
                    maxWidth: 360,
                }}>
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
                        onError={() => setImgLoading(false)}
                    />
                    {imageTitle && title && <h3 style={{
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
                <div className="Container" style={{
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
    )
}

export default Component;
