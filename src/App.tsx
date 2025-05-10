import React from 'react';
import HomePage from 'pages/home';
import Profile from 'pages/profile';
import './_vars.scss';
import './_globals.scss';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
    return (
        <UserProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </UserProvider>
    );
};

export default App;
