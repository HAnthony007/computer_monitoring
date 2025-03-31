import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.1.176:8080/api",
    withCredentials: true,
    timeout: 5000,
});

export default axiosInstance;
