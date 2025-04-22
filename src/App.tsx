import HomePage from 'pages/home';
import './_vars.scss';
import './_globals.scss';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const App: React.FC = () => {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Layout>
        </div>
    );
};

export default App;
