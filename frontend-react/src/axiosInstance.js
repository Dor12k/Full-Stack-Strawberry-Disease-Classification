

import axios from "axios";

import { toast } from 'react-toastify';

console.log("Current build version: 1");

var baseURL = import.meta.env.VITE_BACKEND_BASE_API 
// var baseURL = process.env.VITE_BACKEND_BASE_API;




const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})


// Request Interceptor
axiosInstance.interceptors.request.use(

    function(config){

        const accessToken = localStorage.getItem('accessToken')
        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)?.[1];

        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;

    },
    function(error){
        return Promise.reject(error);
    }
)


let isLoggingOut = false;

// Response Interceptor
axiosInstance.interceptors.response.use(

    function(response){
        return response;
    },

    // Handle failed responses
    async function(error){

        const originalRequest = error.config;

        // Check for 401 and if retry hasn't been attempted already
        if (error.response.status === 401 && !originalRequest.retry && !isLoggingOut) {

            originalRequest.retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            // Ensure refresh token exists
            if (!refreshToken) {

                if (!isLoggingOut) {
                    isLoggingOut = true;
                }

                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Log out and redirect to login page
                setTimeout(() => {
                    window.location.href = '/';
                }, 2500);

                return Promise.reject(error); // Stop further execution of the code
            }

            try {
                const plainAxios = axios.create();
                const response = await plainAxios.post(`${baseURL}/token/refresh/`, {refresh: refreshToken});

                // Attempt to refresh the token
                // const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });

                // Save the new access token
                localStorage.setItem('accessToken', response.data.access);

                // Set the Authorization header with the new token
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                // Retry the original request with the new token
                return axiosInstance(originalRequest);

            } catch (err) {
                
                if (!isLoggingOut) {
                    isLoggingOut = true;
                }

                // If the refresh request fails, log the error and redirect to login
                console.log("Error refreshing token", err);
                toast.error('Session expired. Please log in again.');

                // Clear any residual user data
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Log out and redirect to login page
                setTimeout(() => {
                    window.location.href = '/';
                }, 2500);

                return Promise.reject(err); // Prevent further execution after the redirect
            }
        }

        // Default rejection if not handled
        return Promise.reject(error);
    }
);


export default axiosInstance;