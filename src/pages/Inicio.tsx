import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

function Inicio(){
    return(
        <>
            <header className="flex justify-center md:justify-end items-start md:items-center min-h-[calc(100dvh-52px)] text-white p-4 bg-no-repeat bg-cover bg-left-bottom [background-image:url(/hero.webp);]">
                <div className="w-1/2">
                    <h1 className="text-center font-bold text-[clamp(1.7rem,5vw,5rem)]">DoggyFinder</h1>
                </div>
            </header>
            <main className="container mx-auto px-8 my-8">
                <p className="text-center mb-8">
                    <span className="font-bold">DoggyFinder </span>
                    es una aplicación web que te permite encontrar a tu mejor amigo o publicar un perro perdido.
                </p>

                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>¿Perdiste a tu perro?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 flex-1">
                            <p>No te preocupes, ¡podemos para ayudarte!.</p>
                            <p>Si perdiste a tu perro, puedes publicar un anuncio en la plataforma para que otros usuarios puedan ayudarte a encontrarlo.</p>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-end gap-4">
                            <Link
                                className={buttonVariants({ variant: "secondary", className: "flex-1" })}
                                to="/buscar-encontrados"
                            >Buscar perros encontrados</Link>
                            <Link
                                className={buttonVariants({ variant: "default", className: "flex-1" })}
                                to="/publicar-perdido"
                            >Crear una publicación</Link>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>¿Encontraste un perro?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 flex-1">
                            <p>¡Que buenas noticias!</p>
                            <p>Puedes ayudar a encontrar a su dueño publicando un anuncio en la plataforma.</p>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-end gap-4">
                            <Link
                                className={buttonVariants({ variant: "secondary", className: "flex-1" })}
                                to="/buscar-perdidos"
                            >Buscar perros perdidos</Link>
                            <Link
                                className={buttonVariants({ variant: "default", className: "flex-1" })}
                                to="/publicar-encontrado"
                            >Crear una publicación</Link>
                        </CardFooter>
                    </Card>
                </section>
            </main>
        </>
    )
}

export default Inicio;