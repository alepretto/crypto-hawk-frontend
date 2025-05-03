'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type User = {
    email: string;
    idUser: number;
    username: string;
}


type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType);


export function AuthProvider({children}: {children: ReactNode}) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    const loadUser = async () => {
        try {
            
            setLoading(true);
            const {data} = await axios.get('/api/users/me');
            setUser(data.user);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);
            
        }
    }

    useEffect(() => {
        loadUser();
    }, []);


    const login = async (email: string, password: string) => {
        try {
            console.log('entrou no authProvider')
            await axios.post('/api/users/login', { email, password });

            const { data } = await axios.get('/api/users/me')
            console.log('mostra o resultado', data);
            setUser(data.user);
            router.push('/robo');
            
        } catch (err) {
            console.error(err);
        }
    }

    const logout = async () => {
        await axios.post('/api/users/logout')
        
        setUser(null);
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }

    return context;
}

