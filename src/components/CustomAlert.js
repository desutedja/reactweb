import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useHistory } from 'react-router-dom';

function Component({ isOpen, toggle, title, content }) {
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    let history = useHistory();

    return (
        <Modal
            isOpen={isOpen}
            toggle={() => {
                toggle();

                if (title === 'Token Expired') {
                    history.push('/login');
                    window.location.reload();
                }
            }}
            scrollable={false}
            modalTransition={{ timeout: 1 }}
            backdropTransition={{ timeout: 1 }}
        >
            <ModalHeader toggle={toggle} close={closeBtn}>{title}</ModalHeader>
            <ModalBody>
                {content}
            </ModalBody>
        </Modal>
    )
}

export default Component;
