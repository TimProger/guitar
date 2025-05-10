import axios, { InternalAxiosRequestConfig } from 'axios';
import { Storage } from '../utils/storage';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const API_BASE_URL = `https://geb.onrender.com`;

const $api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        withCredentials: true,
        common: {
            accept: 'application/json',
        },
    },
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
    if (config.headers) {
        config.headers.Authorization = 'Bearer ' + Storage.get('accessToken');
    }
    return config;
};

const refreshAuthLogic = async (error: any) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await $api.post(`/auth/refresh-token`);
            Storage.set('accessToken', 'Bearer ' + response.data.access_token);
        } catch (e) {
            Storage.delete('accessToken');
        }
    }
    throw error;
};

$api.interceptors.request.use(authInterceptor);
createAuthRefreshInterceptor($api, refreshAuthLogic);

export { $api };
