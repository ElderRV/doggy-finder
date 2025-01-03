import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail } from "lucide-react"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="john@example.com" type="email" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" />
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button variant="outline" className="w-full mb-2" onClick={() => {
                        // Implement Google OAuth login here
                        console.log("Google OAuth login initiated")
                    }}>
                        <Mail className="mr-2 h-4 w-4" />
                        Login with Google
                    </Button>
                    <a href="#" className="text-sm text-blue-600 hover:underline" onClick={(e) => {
                        e.preventDefault()
                        // Implement forgot password functionality here
                        console.log("Forgot password clicked")
                    }}>Forgot password?</a>
                </CardFooter>
            </Card>
        </div>
    )
}