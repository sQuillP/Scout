import axios from 'axios';


export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV ==='development';

console.log('isDev:',isDev);

/**
 * Create an api instance for the Scout api
 */
let Scout = axios.create({
    baseURL: 'http://localhost:3030/api/v1',
    headers: {
        'Content-Type':'application/json'
    }
});


/* Set the auth token for any request */
Scout.interceptors.request.use(function(config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});


export default Scout;