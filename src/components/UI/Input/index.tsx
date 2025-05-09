import React from 'react';
import s from './styles.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    full?: boolean;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, full, error, className, ...props }) => {
    return (
        <div className={`${s.inputGroup} ${full ? s.full : ''} ${className || ''}`}>
            {label && <label htmlFor={props.id}>{label}</label>}
            <input {...props} />
            {error && <span className={s.error}>{error}</span>}
        </div>
    );
};

export default Input;
