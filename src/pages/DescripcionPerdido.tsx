import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { borrarPublicacion, obtenerPublicacionPerdido } from "@/firebase";
import useTitle from "@/hooks/useTitle";
import toast from "react-hot-toast";

import { PublicacionPerdidoDB } from "@/types";

import { CalendarDaysIcon, Edit, PhoneIcon, Trash2, User } from "lucide-react";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import MapaUbicacion from "@/components/MapaUbicacion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination, Autoplay } from "swiper/modules";

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

function DescripcionPerdido(){
    const { id } = useParams();
    const [publicacion, setPublicacion] = useState<PublicacionPerdidoDB | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;

        obtenerPublicacionPerdido(id)
        .then(setPublicacion)
    }, [id])

    useTitle(`${publicacion?.nombre ?? "Cargando descripción..."} | DoggyFinder`);

    const handleBorrarPublicacion = async () => {
        if(!id) return;

        const promesa = borrarPublicacion(id, "perdidos");

        await toast.promise(promesa, {
            loading: "Borrando publicación...",
            success: "Publicación borrada",
            error: "Error al borrar la publicación"
        })
        navigate("/buscar-perdidos");
    }

    if(!publicacion) return (
        <main className="container max-w-screen-lg mx-auto px-8 my-8">
            <h1 className="text-center font-bold text-3xl my-8">Cargando...</h1>
        </main>
    )

    return(
        <main className="container max-w-screen-lg mx-auto px-8 my-8">
            <h1 className="text-center font-bold text-3xl my-8">{publicacion.nombre}</h1>

            {
                publicacion.fotos.length > 0 && (
                    <Swiper
                        className="max-w-screen-lg aspect-video max-h-96 select-none rounded-md my-8"
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
                            publicacion.fotos.map((foto, index) => (
                                <SwiperSlide key={index}>
                                    <img className="size-full object-contain" src={foto} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                )
            }

            <Card className="mx-auto my-8 max-w-prose">
                <CardHeader>
                    <h2 className="font-bold text-xl">Administración</h2>
                </CardHeader>

                <CardContent className="flex gap-2 justify-end">
                    <Button>
                        <Edit />
                        Editar
                    </Button>
                    <Button variant="destructive" onClick={handleBorrarPublicacion}>
                        <Trash2 />
                        Borrar
                    </Button>
                </CardContent>
            </Card>

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
                <CardHeader>
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

            {/* // TODO: Comentarios */}
        </main>
    )
}

export default DescripcionPerdido;