import axios, {InternalAxiosRequestConfig} from "axios";
import {Storage} from "../utils/storage";

export const API_BASE_URL = `http://77.239.125.198:8086/api/muslow-service`;

const $api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    common: {
      accept: 'application/json'
    }
  }
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  if(config.headers){
      config.headers.Authorization = "Bearer " + Storage.get("accessToken");
  }
  return config;
};

$api.interceptors.request.use(authInterceptor)

export { $api };