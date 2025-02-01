import { Link } from "react-router";
import { PublicacionPerdidoDB, PublicacionEncontradoDB } from "@/types";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardDescription } from "./ui/card";
import { PhoneIcon } from "lucide-react";

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

function CardPerro({ coleccion, data: { id, fecha, nombreCreador, nombre, descripcion, telefono, fotos }}: { coleccion: string, data: PublicacionPerdidoDB | PublicacionEncontradoDB }){
    return(
        <Card key={id}>
            <Link to={`/buscar-${coleccion}/${id}`}>
                <CardHeader>
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