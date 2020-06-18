import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
// import ReactModal from 'react-modal';

// ReactModal.setAppElement('#root');

function Component({ isOpen, toggle, title, onClick, children, okLabel, cancelLabel='',
    disableHeader=false, disableFooter=false, onClickSecondary=null, 
    disablePrimary=false, disableSecondary=false}) {
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <div>
            <Modal
                isOpen={isOpen}
                scrollable={false}
                modalTransition={{ timeout: 1 }}
                backdropTransition= {{ timeout: 1 }}
                toggle={toggle}
            >
                { !disableHeader && <ModalHeader toggle={toggle} close={closeBtn}><h3>{title}</h3></ModalHeader> }
                <ModalBody>
                    {children}
                </ModalBody>
                { !disableFooter && (<ModalFooter>
                        { !disablePrimary && <Button color="primary" onClick={onClick}>{okLabel}</Button> }
                        {' '}
                        { !disableSecondary && 
                        <Button color="secondary" onClick={onClickSecondary !== null ? onClickSecondary : toggle}>
                            {cancelLabel === '' ? "Cancel" : cancelLabel}
                        </Button> }
                </ModalFooter>) }
            </Modal>
        </div>
    )
}

export default Component;
