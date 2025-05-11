import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import s from './styles.module.scss';
import Modal from '../Modal';
import AuthForm from '../AuthForm';
import { useUser } from '../../contexts/UserContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();

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

    // const handleLogout = () => {
    //     Storage.delete('accessToken');
    //     setUser(null);
    //     navigate('/');
    // };

    return (
        <div className={s.layout}>
            <header className={s.header}>
                <nav className={s.nav}>
                    <NavLink to="/" className={s.logo}>
                        Guitar Trainer
                    </NavLink>
                    <div className={s.navLinks}>
                        {user ? (
                            <>
                                <button onClick={handleProfileClick} className={s.profileLink}>
                                    Профиль
                                </button>
                                {/* <button onClick={handleLogout} className={s.logoutButton}>
                                    Выйти
                                </button> */}
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
