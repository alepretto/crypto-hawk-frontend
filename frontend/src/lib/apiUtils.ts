import cryptoHawkApi from "@/lib/cryptoHawk";


export async function getRefreshedToken(refreshToken: string) {
    console.log(refreshToken);
    const { data } = await cryptoHawkApi.post('/users/login/refresh', null, {
        headers: {
            'refresh-token': refreshToken
        }
    });
        
    return data.access_token ;
}

