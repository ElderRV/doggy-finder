import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail } from "lucide-react"

export default function InicioSesion() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 3000)
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
                    <form onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" placeholder="john@example.com" type="email" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" />
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