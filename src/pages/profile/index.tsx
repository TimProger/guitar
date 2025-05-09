import React from 'react';
import s from './styles.module.scss';

const Profile: React.FC = () => {
    return (
        <div className={s.profile}>
            <h1>Профиль</h1>
            <div className={s.content}>
                <div className={s.info}>
                    <h2>Информация о пользователе</h2>
                    {/* Здесь будет информация о пользователе */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
