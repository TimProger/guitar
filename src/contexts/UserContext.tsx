import React, { createContext, useContext, useState, useEffect } from 'react';
import { $api } from '../http/axios';
import { Storage } from '../utils/storage';

interface User {
    id: number;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Storage.get('accessToken');
            if (token) {
                try {
                    const response = await $api.get('/auth/user');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
