import React, {useEffect,useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

function Component({
    width = '450px',
    isOpen, toggle, title, onClick, children, okLabel = "Yes", cancelLabel = '',
    disableHeader = false, disableFooter = false, onClickSecondary = null,
    disablePrimary = false, disabledOk = false, disableSecondary = false, subtitle="", btnDanger = false,
    className,nameval, ...props
}) {
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;
    const { values } = props;
    const [disablePrimaryBtn, setDisablePrimaryBtn] = useState(disabledOk);

    useEffect(() => {
        setDisablePrimaryBtn(values !== undefined ? values[nameval] ? false : true : true)
    }, [values])

    return (
        <div>
            <Modal
                className={className}
                isOpen={isOpen}
                scrollable={false}
                modalTransition={{ timeout: 1 }}
                backdropTransition={{ timeout: 1 }}
                toggle={toggle}
                style={{
                    maxWidth: width
                }}
            >
                {!disableHeader && <ModalHeader toggle={toggle} close={closeBtn}>
                        <h3>{title}</h3>
                        <h6>{subtitle}</h6> 
                    </ModalHeader>}
                <ModalBody>
                    {children}
                </ModalBody>
                {!disableFooter && (<ModalFooter>
                    {!disablePrimary && <button
                        style={{ color: 'white' }}
                        disabled={disablePrimaryBtn}
                        className={btnDanger ? "Button Danger" : "Button"}
                        // color={btnDanger ? "danger" : "primary"}
                        onClick={onClick}>
                            {okLabel}
                        </button>}
                    {' '}
                    {!disableSecondary &&
                        <Button 
                            style={{ 
                                borderRadius: "6px",
                                border: "1px solid #838383"
                            }}
                            color="secondary" onClick={onClickSecondary !== null ? onClickSecondary : toggle}
                        >
                            {cancelLabel === '' ? "Cancel" : cancelLabel}
                        </Button>}
                </ModalFooter>)}
            </Modal>
        </div>
    )
}

export default Component;
