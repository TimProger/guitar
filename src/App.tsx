import React from 'react';
import HomePage from 'pages/home';
import Profile from 'pages/profile';
import './_vars.scss';
import './_globals.scss';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <div>
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
        </div>
    );
};

export default App;
