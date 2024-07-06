import axios from 'axios';
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

const apiInstance = axios.create({

    baseURL: 'http://127.0.0.1:8000/api/',

    timeout: 50000,

    headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${accessToken}`,
        Accept: 'application/json', 
    },
});


export default apiInstance;
