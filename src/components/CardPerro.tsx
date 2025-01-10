import { Link } from "react-router";
import { PublicacionPerdidoDB } from "@/types";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardDescription } from "./ui/card";

function CardPerro({ data: { id, fecha, nombreCreador, nombre, descripcion, telefono, fotos }}: { data: PublicacionPerdidoDB }){
    return(
        <Card key={id}>
            <Link to={`/buscar-perdidos/${id}`}>
                <CardHeader>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,100px),1fr))] gap-4">
                        {/* //TODO: Poner un slider para mostrar las fotos (o solamente mostrar una foto en esta previsualización) */}
                        {
                            fotos.length > 0 && (
                                fotos.map((foto, index) => (
                                    <img className="size-full border shadow !m-0 rounded-md" src={foto} key={index} />
                                ))
                            )
                        }
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 justify-between">
                        <span className="flex-1 min-w-fit">{nombreCreador}</span>
                        {/* // TODO: Usar date-fns como en los comentarios para mostrar el tiempo que lleva la publicación */}
                        <span className="flex-1 min-w-fit [&::first-letter]:capitalize text-right">
                            {
                                formatDistance(
                                    new Date(fecha),
                                    new Date(),
                                    {
                                        addSuffix: true,
                                        locale: es
                                    }
                                )
                            }
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <h3 className="text-center font-bold text-lg mb-2">{nombre}</h3>
                    <p>{descripcion}</p>
                    <span>{telefono}</span>
                </CardContent>
            </Link>
        </Card>
    )
}

export default CardPerro;