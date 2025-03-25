import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useTitle from "@/hooks/useTitle";

import { PublicacionEncontradoDB, PublicacionPerdidoDB } from "@/types";

import { CalendarDaysIcon, PhoneIcon, User } from "lucide-react";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Protegido from "./Protegido";
import SliderDescripcion from "./SliderDescripcion";
import MapaUbicacion from "@/components/MapaUbicacion";
import AdministracionPublicacion from "./AdministracionPublicacion";
import Comentarios from "./Comentarios";
import { cn } from "@/lib/utils";

interface DescripcionPublicacionProps {
    tipo: string;
    obtenerPublicacion: (id: string) => Promise<PublicacionPerdidoDB | PublicacionEncontradoDB>;
    borrarPublicacion: (id: string) => Promise<void>;
}

function DescripcionPublicacion({ tipo, obtenerPublicacion, borrarPublicacion }: DescripcionPublicacionProps){
    const { id } = useParams();
    const [publicacion, setPublicacion] = useState<PublicacionPerdidoDB | PublicacionEncontradoDB | undefined | null>(undefined);

    useEffect(() => {
        if(!id) return;

        obtenerPublicacion(id)
        .then(data => {
            if(!data) return setPublicacion(null);

            setPublicacion(data);
        })
    }, [id])

    useTitle(`${publicacion?.nombre ?? "Cargando descripción..."} | DoggyFinder`);

    if(publicacion === undefined) return (
        <main className="container max-w-screen-lg mx-auto px-8 my-8">
            <h1 className="text-center font-bold text-3xl my-8">Cargando...</h1>
        </main>
    )

    if(publicacion === null) return (
        <main className="container max-w-screen-lg mx-auto px-8 my-8">
            <h1 className="text-center font-bold text-3xl my-8">Esta publicación no existe</h1>
        </main>
    )

    return(
        <main className="container max-w-screen-lg mx-auto px-8 my-8">
            <h1 className="text-center font-bold text-3xl my-8">{publicacion.nombre}</h1>

            {
                publicacion.fotos.length > 0 && (
                    <SliderDescripcion publicacion={publicacion} />
                )
            }

            <Protegido
                names={["general/administrar-publicacion", "personal:publicacion/administrar-publicacion"]}
                type="component"
                params={{ coleccion: tipo === "perdido" ? "perdidos" : "encontrados" }}
                cargandoComponent={<></>}
                errorComponent={<></>}
            >
                <AdministracionPublicacion tipo={tipo} borrarPublicacion={borrarPublicacion} />
            </Protegido>

            <div className="flex flex-col flex-wrap gap-4">
                <div className="flex flex-wrap gap-4 justify-between">
                    <span className="flex gap-2">
                        <User />
                        {publicacion.nombreCreador}
                    </span>

                    <span className="flex gap-2">
                        <PhoneIcon />
                        {publicacion.telefono}
                    </span>
                </div>

                <span className="flex gap-2 self-end">
                    <CalendarDaysIcon />
                    {
                        formatDistance(
                            new Date(publicacion.fecha),
                            new Date(),
                            {
                                addSuffix: true,
                                locale: es
                            }
                        )
                    }
                </span>
            </div>

            <Card className="mx-auto my-8 max-w-prose">
                <CardHeader className="relative">
                    <span className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm px-4 py-1 rounded-md", tipo === "perdido" ? "bg-red-800" : "bg-green-800")}>
                        { tipo === "perdido" ? "Perdido" : "Encontrado" }
                    </span>
                    <h2 className="text-center font-bold text-2xl">{publicacion.nombre}</h2>
                </CardHeader>

                <CardContent>
                    <p>{publicacion.descripcion}</p>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4 items-center my-8">
                <h2 className="font-bold text-xl">Ubicación</h2>
                
                <MapaUbicacion className="border shadow rounded-md" ubicacion={publicacion.direccion} />
            </div>

            <Comentarios />
        </main>
    )
}

export default DescripcionPublicacion;