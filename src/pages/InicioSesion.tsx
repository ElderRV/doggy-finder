import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail } from "lucide-react"
import { useForm } from 'react-hook-form'

interface InicioSesionFormValues {
    email: string;
    password: string;
}

export default function InicioSesion() {
    const { register, handleSubmit, formState, reset } = useForm<InicioSesionFormValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(data: InicioSesionFormValues) {
        console.log(data);
        setIsLoading(true);

        // Simular carga del inicio de sesión
        await new Promise((res) => {
            setTimeout(() => {
                setIsLoading(false);
                reset();
                res(null);
            }, 3000)
        })
    }

    const handleGoogleOauth = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(e);
        //TODO: Implementar Google OAuth inicio de sesión
        console.log("Inicio de sesión Google OAuth iniciado");
    }

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        //TODO: Implementar recuperación de contraseña
        console.log("Recuperación de contraseña iniciada");
    }

    return (
        <main className="flex justify-center my-16">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Iniciar sesión</CardTitle>
                    <CardDescription>Introduce tus credenciales para iniciar sesión</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input {...register("email", {
                                    required: "El correo electrónico es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Introduce un correo electrónico válido"
                                    }
                                })} id="email" placeholder="john@example.com" type="email" />
                                {
                                    formState.errors.email && (
                                        <span className="text-sm text-red-500">{formState.errors.email.message}</span>
                                    )
                                }
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input {...register('password', {
                                    required: "La contraseña es requerida",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres"
                                    }
                                })} id="password" type="password" />
                                {
                                    formState.errors.password && (
                                        <span className="text-sm text-red-500">{formState.errors.password.message}</span>
                                    )
                                }
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button variant="outline" className="w-full mb-2" onClick={handleGoogleOauth}>
                        <Mail className="mr-2 h-4 w-4" />
                        Iniciar sesión con Google
                    </Button>
                    <a href="#" className="text-sm text-blue-600 hover:underline" onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</a>
                </CardFooter>
            </Card>
        </main>
    )
}