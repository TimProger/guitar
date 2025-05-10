import React from 'react';
import s from './styles.module.scss';
import { useUser } from '../../contexts/UserContext';

const Profile: React.FC = () => {
    const { user } = useUser();

    if (!user) {
        window.location.href = '/';
        return <div>Loading...</div>;
    }

    return (
        <div className={s.profile}>
            <h1>Профиль</h1>
            <div className={s.content}>
                <div className={s.info}>
                    <h2>Информация о пользователе</h2>
                    <p>Имя: {user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
