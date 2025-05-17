import cryptoHawkApi from "@/lib/cryptoHawk";
import { cookies } from "next/headers";


export async function getRefreshedToken(refreshToken: string) {

    const { data } = await cryptoHawkApi.post('/users/login/refresh', null, {
        headers: {
            'refresh-token': refreshToken
        }
    });
        
    return data.access_token ;
}



export async function authenticatedRequest(endpoint: string, method: "get" | "post" = "get", params = {}, data = {}) {
    
    const cookieStore = cookies();
    let token = (await cookieStore).get('auth-token')?.value;

    if (!token) return { error: 'Not Authorized', status: 401 }

    let response;

    if (method === 'get') {
        response = await cryptoHawkApi[method](endpoint, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        }).catch(err => err.response);
    
    } else {
    
        response = await cryptoHawkApi[method](endpoint, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            }
        ).catch(err => err.response);

    }
    
    if (response.status === 200) return { data: response.data, token, status: response.status, };

    if (response.status === 401) {
        const refreshToken = (await cookieStore).get(`refresh-token`)?.value;

        if (!refreshToken) return { error: 'Not Authorized', status: 401 }

        token = await getRefreshedToken(refreshToken);

        if (method === 'get') {
            response = await cryptoHawkApi[method](endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            }).catch(err => err.response);
        
        } else {
        
            response = await cryptoHawkApi[method](endpoint, data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params
                }
            ).catch(err => err.response);
    
        }

        return {
            status: response.status,
            data: response.data,
            token,
            refreshed: true
        };
    }

    return { error: response, status: response.status}

}
