import React, { createContext, useContext, useState, useEffect } from 'react';
import { $api } from '../http/axios';
import { Storage } from '../utils/storage';

interface IUser {
    id: number;
    email: string;
}

interface IUserContext {
    user: IUser | null;
    isLoading: boolean;
}

const UserContext = createContext<IUserContext>({
    user: null,
    isLoading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Storage.get('accessToken');
        if (token) {
            $api.get('/auth/user')
                .then((response) => {
                    setUser(response.data);
                })
                .catch(() => {
                    Storage.delete('accessToken');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
