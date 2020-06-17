import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function Component({ isOpen, toggle, title, content }) {
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            scrollable={false}
            modalTransition={{ timeout: 1 }}
            backdropTransition={{ timeout: 1 }}
        >
            <ModalHeader toggle={toggle} close={closeBtn}><h5>{title}</h5></ModalHeader>
            <ModalBody>
                {content}
            </ModalBody>
        </Modal>
    )
}

export default Component;
