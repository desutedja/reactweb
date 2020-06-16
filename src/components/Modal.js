import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
// import ReactModal from 'react-modal';

// ReactModal.setAppElement('#root');

function Component({ isOpen, toggle, title, onClick, children, okLabel }) {
    return (
        <div>
            <Modal
                isOpen={isOpen}
                toggle={toggle}
            >
                <ModalHeader><h3>{title}</h3></ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onClick}>{okLabel}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Component;
