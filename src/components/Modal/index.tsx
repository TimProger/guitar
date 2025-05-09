import React from 'react';
import s from './styles.module.scss';
import classNames from 'classnames';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
        }
    };

    return (
        <div
            className={classNames(s.modalOverlay, { [s.open]: isOpen })}
            onClick={onClose}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div
                role="button"
                tabIndex={0}
                className={s.modalContent}
                onKeyDown={() => {}}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={s.closeButton} onClick={onClose} onKeyDown={handleKeyDown}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
