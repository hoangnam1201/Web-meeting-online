import axios from "axios";
import { Cookies } from 'react-cookie';

const baseURL = process.env.baseURL || 'http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/'

const instance = axios.create({ baseURL });
const cookies = new Cookies();

instance.interceptors.request.use((config) => {
    const auth = cookies.get('u_auth');
    if (auth) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        return config;
    }
    return config;
})

instance.interceptors.response.use((response) => {
    return response.data;
}, (err) => {
    if (err.response.status === 401) {
        cookies.remove('u_auth', { path: '/' });
        return Promise.reject(err);
    }
    return Promise.reject(err);
})

export default instance;
