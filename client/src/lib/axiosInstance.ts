import axios from "axios";

export const apiURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${apiURL}/api`,
    withCredentials: true,
    timeout: 5000,
});

export default axiosInstance;
