import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthProvider';
import useTitle from '@/hooks/useTitle';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";


interface RegistroFormValues {
    name: string;
    email: string;
    password: string;
}

export default function Registro() {
    const { registrarUsuario, iniciarSesionGoogle } = useAuth()!;
    const { register, handleSubmit, formState } = useForm<RegistroFormValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useTitle("Registrarse | DoggyFinder");

    async function onSubmit(data: RegistroFormValues) {
        setIsLoading(true);

        const promesa = registrarUsuario({
            name: data.name,
            email: data.email,
            password: data.password
        })
        await toast.promise(promesa, {
            loading: 'Registrando usuario...',
            success: 'Usuario registrado',
            error: (error) => {
                setIsLoading(false);
                return error.message;
            }
        })

        navigate("/");
    }

    const handleGoogleOauth = async () => {
        await iniciarSesionGoogle();
        navigate("/");
    }

    return (
        <main className="flex justify-center my-16">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Crear una cuenta</CardTitle>
                    <CardDescription>Introduce tus datos para registrarte</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Nombre</Label>
                                <Input {...register('name', {
                                    required: 'El nombre es requerido',
                                    minLength: {
                                        value: 3,
                                        message: 'El nombre debe tener al menos 3 caracteres'
                                    }
                                })} id="name" placeholder="John Doe" />
                                {
                                    formState.errors.name && (
                                        <span className="text-red-500 text-sm">{formState.errors.name.message}</span>
                                    )
                                }
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input {...register('email', {
                                    required: 'El correo electrónico es requerido',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Introduce un correo electrónico válido'
                                    }
                                })} id="email" placeholder="john@example.com" type="email" />
                                {
                                    formState.errors.email && (
                                        <span className="text-red-500 text-sm">{formState.errors.email.message}</span>
                                    )
                                }
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input {...register('password', {
                                    required: 'La contraseña es requerida',
                                    minLength: {
                                        value: 6,
                                        message: 'La contraseña debe tener al menos 6 caracteres'
                                    }
                                })} id="password" type="password" />
                                {
                                    formState.errors.password && (
                                        <span className="text-red-500 text-sm">{formState.errors.password.message}</span>
                                    )
                                }
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                "Registrar"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleGoogleOauth}>
                        <Mail className="mr-2 h-4 w-4" />
                        Iniciar sesión con Google
                    </Button>
                </CardFooter>
            </Card>
        </main>
    )
}