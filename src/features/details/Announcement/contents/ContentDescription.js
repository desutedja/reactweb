import React, {  } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import parse from 'html-react-parser';

import { useSelector } from 'react-redux';
import { toSentenceCase } from '../../../../utils';

function Component() {
    const selected = useSelector(state => state.announcement.selected);

    return (
        <div className="Container" style={{ paddingRight: 8 }}>
        <div
          style={{
            flexDirection: "column",
            overflow: "auto",
            paddingRight: 16,
          }}
        >
          {console.log(selected.description)}
          {selected.image && <CardImg src={selected.image} alt="Announcement Image"/>}
          <CardTitle style={{ marginTop: 30, marginBottom: 15 }}><h4>{toSentenceCase(selected.title)}</h4></CardTitle>
          {parse(selected.description ? selected.description : "")}
        </div>
      </div>
    )
}

export default Component;
