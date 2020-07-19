import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useHistory } from 'react-router-dom';

function Component({ isOpen, toggle, title, subtitle='', content }) {
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
            <ModalHeader toggle={toggle} close={closeBtn}>
            {title}
            </ModalHeader>
            <ModalBody>
                {subtitle && <p style={{ color: 'red', size: '11', fontWeight: 'bold', overflowWrap: 'break-word', textAlign: 'left'  }} >{subtitle}</p>} 
                <hr/>
                <p style={{ color: 'red' }}>Error Message : {content}</p>
            </ModalBody>
        </Modal>
    )
}

export default Component;
