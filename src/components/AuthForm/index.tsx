import React, { useState } from 'react';
import s from './styles.module.scss';
import Input from '../UI/Input';
import Button from '../UI/Button';
import axios from 'axios';
import { $api } from '../../http/axios';
import { Storage } from '../../utils/storage';

interface AuthFormProps {
    onSuccess: () => void;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (mode === 'register' && password !== confirmPassword) {
            setErrors({ confirmPassword: 'Пароли не совпадают' });
            return;
        }

        try {
            const endpoint = `/auth/${mode}`;
            const response = await $api.post(endpoint, {
                email,
                password,
            });

            if (response.status === 200) {
                Storage.set('accessToken', response.data.access_token);
                onSuccess();
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorData = err.response?.data;
                if (errorData?.fields) {
                    setErrors(errorData.fields);
                } else {
                    switch (errorData?.detail) {
                        case 'Incorrect email or password':
                            setErrors({ general: 'Неверный email или пароль' });
                            break;
                        case 'User already exists':
                            setErrors({ email: 'Пользователь уже существует' });
                            break;
                        default:
                            setErrors({ general: 'Произошла ошибка при авторизации' });
                    }
                }
            } else {
                setErrors({ general: 'Произошла неизвестная ошибка' });
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
        }
    };

    return (
        <form className={s.form} onSubmit={handleSubmit} autoComplete="off">
            <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

            {errors.general && <div className={s.error}>{errors.general}</div>}

            <Input
                full
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={mode === 'login' ? 'username' : 'new-username'}
                required
                error={errors.email}
            />

            <Input
                full
                type="password"
                label="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                error={errors.password}
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
                    error={errors.confirmPassword}
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
