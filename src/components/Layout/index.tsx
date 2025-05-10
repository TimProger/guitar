import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './styles.module.scss';
import Modal from '../Modal';
import AuthForm from '../AuthForm';
import { useUser } from '../../contexts/UserContext';
import { Storage } from '../../utils/storage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleProfileClick = () => {
        if (user) {
            navigate('/profile');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleAuthSuccess = () => {
        setIsModalOpen(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        Storage.delete('accessToken');
        setUser(null);
        navigate('/');
    };

    return (
        <div className={s.layout}>
            <header className={s.header}>
                <nav className={s.nav}>
                    <a href="/" className={s.logo}>
                        Guitar Trainer
                    </a>
                    <div className={s.navLinks}>
                        {user ? (
                            <>
                                <span className={s.userEmail}>{user.email}</span>
                                <button onClick={handleLogout} className={s.logoutButton}>
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <button onClick={handleProfileClick} className={s.profileLink}>
                                Профиль
                            </button>
                        )}
                    </div>
                </nav>
            </header>
            <main className={s.main}>{children}</main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AuthForm onSuccess={handleAuthSuccess} />
            </Modal>
        </div>
    );
};

export default Layout;
