import React, { } from 'react';
import { FiGlobe } from 'react-icons/fi';

import Container from '../../../components/Container';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Tab from '../../../components/Tab';

function Component({image, title, website, labels, contents}) {
    return (
        <Row>
            {image && <Container flex={3}>
                <Column>
                    {image && <img alt="Avatar" src={image} style={{
                        maxHeight: 400,
                        objectFit: 'cover',
                        width: '100%',
                        marginBottom: 16,
                    }} />}
                    {title && <h3 style={{
                        marginBottom: 8,
                    }}>{title}</h3>}
                    {website && <Row center>
                        <FiGlobe style={{
                            marginRight: 8,
                        }} />
                        <h5><a href={website}>{website}</a></h5>
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
