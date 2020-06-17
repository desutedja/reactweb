import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
// import ReactModal from 'react-modal';

// ReactModal.setAppElement('#root');

function Component({ isOpen, toggle, title, onClick, children, okLabel, disableHeader=false, disableFooter=false}) {
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <div>
            <Modal
                isOpen={isOpen}
                scrollable={false}
                modalTransition={{ timeout: 1 }}
                backdropTransition= {{ timeout: 1 }}
            >
                { !disableHeader && <ModalHeader toggle={toggle} close={closeBtn}><h3>{title}</h3></ModalHeader> }
                <ModalBody>
                    {children}
                </ModalBody>
                { !disableFooter && (<ModalFooter>
                    <Button color="primary" onClick={onClick}>{okLabel}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>) }
            </Modal>
        </div>
    )
}

export default Component;
