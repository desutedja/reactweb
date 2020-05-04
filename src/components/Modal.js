import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function Component({ isOpen, onRequestClose, children }) {
    return (
        <div>
            <ReactModal
                shouldCloseOnOverlayClick
                onRequestClose={onRequestClose}
                isOpen={isOpen}
                style={{
                    content: {
                        position: 'unset',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 16,
                    },
                    overlay: {
                        zIndex: 99,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }
                }}
            >
                {children}
            </ReactModal>
        </div>
    )
}

export default Component;