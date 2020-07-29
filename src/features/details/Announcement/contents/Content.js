import React, {  } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import parse from 'html-react-parser';

import { useSelector } from 'react-redux';

function Component() {
    const selected = useSelector(state => state.announcement.selected);

    return (
        <div>
            <Card style= {{ width: "500px" }}>
                {selected.image && <CardImg src={selected.image} alt="Announcement Image"/>}
                <CardBody>
                    <CardTitle><h4>{selected.title}</h4></CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText style={{
                        paddingTop: 8,
                    }}>{parse(selected.description || "Loading..")}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

export default Component;
