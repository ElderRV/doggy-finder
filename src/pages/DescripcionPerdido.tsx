import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination, Autoplay } from "swiper/modules";
import { CalendarDaysIcon, PhoneIcon, User } from "lucide-react";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import MapaUbicacion from "@/components/MapaUbicacion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/keyboard";

function DescripcionPerdido(){
    const publicacion = {
        id: "id",
        fecha: 1736379857428,
        idCreador: "idCreador",
        nombreCreador: "Fulanita",
        nombre: "Perro",
        descripcion: "Es un perro negro con blanco de tamaño mediano. Se perdió con una correa azul. Se perdió por la colonia X.",
        telefono: "1231231231",
        direccion: { longitud: -103, latitud: 21 },
        fotos: ["/hero.webp", "/hero.webp"]
    }

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

            <div className="flex flex-col gap-4 items-center  my-8">
                <h2 className="font-bold text-xl">Ubicación</h2>
                
                <MapaUbicacion className="border shadow rounded-md" ubicacion={publicacion.direccion} />
            </div>

            {/* // TODO: Comentarios */}
        </main>
    )
}

export default DescripcionPerdido;