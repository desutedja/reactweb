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
            <Row>
                {(image || title) && <Container flex={3}>
                    <Column>
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
                                minWidth: 300,
                                maxHeight: 400,
                                objectFit: 'cover',
                                width: '100%',
                                marginBottom: 16,
                            }}
                            onLoad={() => setImgLoading(false)}
                        />
                        {title && <h3 style={{
                            marginBottom: 16,
                        }}>{title}</h3>}
                        {website && <Row center style={{
                            marginBottom: 8,
                        }}>
                            <FiGlobe style={{
                                marginRight: 8,
                                fontSize: '1.2rem',
                            }} />
                            <h5><a href={website}>{website}</a></h5>
                        </Row>}
                        {email && <Row center style={{
                            marginBottom: 8,
                        }}>
                            <FiMail style={{
                                marginRight: 8,
                                fontSize: '1.2rem',
                            }} />
                            <h5><a href={"mailto:" + email}>{email}</a></h5>
                        </Row>}
                        {phone && <Row center style={{
                            marginBottom: 8,
                        }}>
                            <FiPhone style={{
                                marginRight: 8,
                                fontSize: '1.2rem',
                            }} />
                            <h5>{phone}</h5>
                        </Row>}
                        {merchant && <Row center style={{
                            marginBottom: 8,
                        }}>
                            <FiHome style={{
                                marginRight: 8,
                                fontSize: '1.2rem',
                            }} />
                            <h5>{merchant}</h5>
                        </Row>}
                    </Column>
                </Container>}
                <Container flex={9}>
                    <Tab
                        labels={labels}
                        contents={contents}
                    />
                </Container>
            </Row>
        </>
    )
}

export default Component;
