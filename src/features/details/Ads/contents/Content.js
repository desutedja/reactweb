import React, {  } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import parse from 'html-react-parser';

import { useSelector } from 'react-redux';

function Component() {
    const selected = useSelector(state => state.ads.selected);

    return (
        <div>
            <Card style= {{ width: "500px" }}>
                {selected.content_video && <CardImg src={selected.content_video} alt="Ads Content"/>}
                {selected.content_image && <CardImg src={selected.content_image} alt="Ads Content"/>}
                <CardBody>
                    <CardTitle><h4>{selected.content_name}</h4></CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText style={{
                        paddingTop: 8,
                    }}>{parse(selected.content_description)}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

export default Component;
