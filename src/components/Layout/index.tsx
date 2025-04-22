import React from 'react';
// import { NavLink } from "react-router-dom";
import s from './styles.module.scss';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={s.layout}>
            <header>
                <div>
                    <h2>Guitar Emulator</h2>
                    {/* <NavLink to={'/profile'}><h3>Profile</h3></NavLink> */}
                </div>
            </header>

            <main>{children}</main>
        </div>
    );
};

export default Layout;
