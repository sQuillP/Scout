import axios from 'axios';


export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV ==='development';

export const URL = isDev ? 'http://localhost:3030/api/v1/':'new link!'

console.log('isDev:',isDev, URL);

/**
 * Create an api instance for the Scout api
 */
let Scout = axios.create({
    baseURL: 'http://54.189.145.156:3030/api/v1',
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