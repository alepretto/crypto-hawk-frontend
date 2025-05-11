import axios from "axios";


const cryptoHawkApi = axios.create({
    baseURL: process.env.API_URL,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});



export default cryptoHawkApi;

