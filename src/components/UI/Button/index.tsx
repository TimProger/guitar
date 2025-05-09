import React from 'react';
import s from './styles.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    full?: boolean;
    variant?: 'primary' | 'secondary' | 'text';
}

const Button: React.FC<ButtonProps> = ({
    children,
    full,
    variant = 'primary',
    className,
    ...props
}) => {
    return (
        <button
            className={`${s.button} ${s[variant]} ${full ? s.full : ''} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
