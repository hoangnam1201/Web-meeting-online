import axios from "axios";
import { Cookies } from 'react-cookie';

const baseURL = process.env.baseURL || 'http://localhost:3002/api/'

const instance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
    const auth = new Cookies().get('u_auth');
    if (auth) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        return config;
    }
    return config;
})

instance.interceptors.response.use((response) => {
    return response.data;
}, (err) => {
    return Promise.reject(err);
})

export default instance;