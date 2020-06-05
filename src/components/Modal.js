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
                        maxWidth: '50%',
                        position: 'unset',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 16,
                    },
                    overlay: {
                        zIndex: 99,
                        backgroundColor: 'rgba(0,0,0,0.5)',
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
