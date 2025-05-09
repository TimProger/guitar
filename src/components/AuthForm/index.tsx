import React, { useState } from 'react';
import s from './styles.module.scss';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface AuthFormProps {
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика авторизации
        console.log('Form submitted:', { email, password, mode });
        onSuccess();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
        }
    };

    return (
        <form className={s.form} onSubmit={handleSubmit} autoComplete="off">
            <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

            <Input
                full
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={mode === 'login' ? 'username' : 'new-username'}
                required
            />

            <Input
                full
                type="password"
                label="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
            />

            {mode === 'register' && (
                <Input
                    full
                    type="password"
                    label="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
            )}

            <Button full type="submit" variant="primary">
                {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <div className={s.switchMode}>
                {mode === 'login' ? (
                    <p>
                        Нет аккаунта?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            onKeyDown={(e) => handleKeyDown(e)}
                            tabIndex={0}
                        >
                            Зарегистрироваться
                        </button>
                    </p>
                ) : (
                    <p>
                        Уже есть аккаунт?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            onKeyDown={(e) => handleKeyDown(e)}
                            tabIndex={0}
                        >
                            Войти
                        </button>
                    </p>
                )}
            </div>
        </form>
    );
};

export default AuthForm;
