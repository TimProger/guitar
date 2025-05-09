import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import s from './styles.module.scss';
import Modal from '../Modal';
import AuthForm from '../AuthForm';
import { Storage } from '../../utils/storage';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = (e: React.MouseEvent) => {
        if (!Storage.get('accessToken')) {
            e.preventDefault();
            setIsAuthModalOpen(true);
        }
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
        navigate('/profile');
    };

    return (
        <div className={s.layout}>
            <header>
                <div>
                    <NavLink to={'/'} className={s.profileLink}>
                        <h2>Guitar Emulator</h2>
                    </NavLink>
                    <div className={s.profileLinks}>
                        <NavLink
                            to={'/profile'}
                            className={s.profileLink}
                            onClick={handleProfileClick}
                        >
                            <p>Профиль</p>
                        </NavLink>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
                <AuthForm onSuccess={handleAuthSuccess} />
            </Modal>
        </div>
    );
};

export default Layout;
