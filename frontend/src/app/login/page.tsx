'use client'

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setError("");

        try {
            await login(email, password);
        } catch (err) {
            console.error(err);
            setError("Email ou senha invalidos");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center ">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-xl shadow-lg w-100 flex flex-col gap-4">
                
                <h1 className="text-center font-bold text-2xl">Login</h1>
        
                <input
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
        
                <input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
        
                {error && <p style={{ color: "red" }}>{error}</p>}
        
                <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition transform hover:scale-105 cursor-pointer"
                >
                    Entrar
                </button>
            </form>
        </div>
      );
}
