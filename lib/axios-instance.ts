"use client"

import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
    }
);

export const http_request = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    try {
        return await axiosInstance(config);
    } catch (error) {
        throw error;
    }
};
