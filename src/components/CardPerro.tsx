import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { PublicacionPerdidoDB, PublicacionEncontradoDB } from "@/types";

import { borrarPublicacion } from "@/firebase";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardDescription } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Edit, PhoneIcon, Trash2 } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination, Autoplay } from "swiper/modules";

import Protegido from "./Protegido";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/keyboard";

function CardPerro({ coleccion, data: { id, fecha, nombreCreador, nombre, descripcion, telefono, fotos }}: { coleccion: string, data: PublicacionPerdidoDB | PublicacionEncontradoDB }){
    const [borrado, setBorrado] = useState<boolean>(false);

    const handleBorrarPublicacion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Evita que el link padre se ejecute
        e.preventDefault();

        const promesa = borrarPublicacion(coleccion, id);

        await toast.promise(promesa, {
            loading: "Borrando publicación...",
            success: () => {
                // Se oculta la card borrada
                setBorrado(true);
                return "Publicación borrada";
            },
            error: "Error al borrar la publicación"
        })
    }

    if(borrado) return <></>;

    return(
        <Card key={id}>
            <Link to={`/buscar-${coleccion}/${id}`}>
                <CardHeader>
                    <Protegido
                        names={["general/administrar-publicacion", "personal:publicacion/administrar-publicacion"]}
                        type="component"
                        params={{ coleccion, id }}
                        cargandoComponent={<></>}
                        errorComponent={<></>}
                    >
                        <div className="self-end flex gap-2">
                            <Link
                                className={buttonVariants({ variant: "outline", className: "text-yellow-500 hover:text-yellow-500" })}
                                to={`/editar-${coleccion.slice(0,-1)}/${id}`}>
                                <Edit />
                                Editar
                            </Link>
                            <Button
                                onClick={handleBorrarPublicacion}
                                variant="outline"
                                className="text-red-500 hover:text-red-500"
                            >
                                <Trash2 />
                                Borrar
                            </Button>
                        </div>
                    </Protegido>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,100px),1fr))] gap-4">
                        {
                            fotos.length > 0 && (
                                <Swiper
                                    className="w-full aspect-video select-none"
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    modules={[Navigation, Pagination, Keyboard, Autoplay]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    keyboard={{
                                        enabled: true
                                    }}
                                    autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
                                    loop
                                >
                                    {
                                        fotos.map((foto, index) => (
                                            <SwiperSlide key={index}>
                                                <img className="size-full object-contain" src={foto} />
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            )
                        }
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 justify-between">
                        <span className="flex-1 min-w-fit">{nombreCreador}</span>
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
                <CardContent className="flex flex-col gap-4">
                    <h3 className="text-center font-bold text-lg mb-2">{nombre}</h3>
                    <p>{descripcion}</p>
                    <span className="flex gap-2 items-center">
                        <PhoneIcon className="size-5" />
                        {telefono}
                    </span>
                </CardContent>
            </Link>
        </Card>
    )
}

export default CardPerro;