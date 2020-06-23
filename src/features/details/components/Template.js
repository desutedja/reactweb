import React, { } from 'react';
import { FiGlobe, FiPhone } from 'react-icons/fi';

import Container from '../../../components/Container';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Tab from '../../../components/Tab';

function Component({ image, title, website, phone, labels, contents }) {
    return (
        <Row>
            {(image || title) && <Container flex={3}>
                <Column>
                    <img
                        alt="Avatar"
                        src={image ? image :
                            require('../../../assets/fallback.jpg')}
                        style={{
                            maxHeight: 400,
                            objectFit: 'cover',
                            width: '100%',
                            marginBottom: 16,
                        }}
                    />
                    {title && <h3 style={{
                        marginBottom: 16,
                    }}>{title}</h3>}
                    {website && <Row center>
                        <FiGlobe style={{
                            marginRight: 8,
                        }} />
                        <h5><a href={website}>{website}</a></h5>
                    </Row>}
                    {phone && <Row center>
                        <FiPhone style={{
                            marginRight: 8,
                        }} />
                        <h5>{phone}</h5>
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
    )
}

export default Component;
