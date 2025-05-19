'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";


import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { string, z } from "zod"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import Image from "next/image";




const formSchema = z.object({
    email: z.string().email({
        message: "Por favor, insira um email válido.",
    }),
    password: z.string().min(6, {
        message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    rememberMe: z.boolean(),
})




export default function LoginPage() {

    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        console.log("Login attempt:", values)

        try {
            const email = values.email;
            const password = values.password;
            await login(email, password);

            const remember = values.rememberMe
            if (remember) {
                localStorage.setItem("savedEmail", values.email);
                localStorage.setItem("rememberMe", String(remember));
            }


        } catch (err: any) {

            toast(err.response?.data?.message || "Email ou senha inválidos.");

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const saved = localStorage.getItem("savedEmail");
        if (saved) {
            form.setValue("email", saved); // depende da lib de form que você estiver usando
        }
        const remember = localStorage.getItem("rememberMe");
        form.setValue("rememberMe", remember === "true");
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">

            <Toaster  position="top-center"/>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                <div className="flex justify-center mb-6">
                    <div className="w-full h-20 flex items-center justify-center">
                        <Image
                            src="/logo-transparante-2.png"
                            alt="AlgoQuant Logo"
                            width={250}
                            height={30}
                        />
                    {/* <Lock className="h-6 w-6 text-primary-foreground" /> */}
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Trading Platform</CardTitle>
                <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="seu@email.com" className="pl-10" {...field} disabled={isLoading} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between">
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 ">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} className="cursor-pointer" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">Lembrar-me</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Entrando..." : "Entrar"}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" disabled={isLoading}>
                            Google
                        </Button>
                        <Button variant="outline" disabled={isLoading}>
                            GitHub
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                        Registre-se
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
