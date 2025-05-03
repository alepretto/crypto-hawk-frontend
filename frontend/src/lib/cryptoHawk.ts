import axios from "axios";


const cryptoHawkApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(';').shift();
}


cryptoHawkApi.interceptors.request.use((config) => {

    if (typeof window !== "undefined") {
        const token = getCookie('auth-token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  });


cryptoHawkApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('Erro na requisição, mas continuando fluxo:', error);
        return Promise.reject(error); 
    }
);



export default cryptoHawkApi;