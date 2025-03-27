import { useEffect, useState } from "react";
import { BotMessageSquare, ScanSearch } from "lucide-react";

import { PublicacionEncontradoDB, PublicacionPerdidoDB } from "@/types";
import { DescripcionPublicacionProps } from "./DescripcionPublicacion";

import { Card, CardContent, CardHeader } from "./ui/card";
import CardPerro from "./CardPerro";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";

interface SliderSimilaresProps {
    tipo: DescripcionPublicacionProps["tipo"];
    raza: string;
}

function SliderSimilares({ tipo, raza="sin_raza" }: SliderSimilaresProps){
    const [publicacionesSimilares, setPublicacionesSimilares] = useState<PublicacionEncontradoDB[] | PublicacionPerdidoDB[] | undefined>(undefined);

    useEffect(() => {
        if(!tipo || !raza) return setPublicacionesSimilares([]);

        // TODO: Procedimiento para buscar las publicaciones similares
        // const similares = await buscarSimilares(tipo, raza);
        const similares: PublicacionEncontradoDB[] | PublicacionPerdidoDB[] = [{ id: "1", nombre: "Perro 1", fecha: Date.now()-Math.random()*50000000, descripcion: "Descripción 1", fotos: ["https://picsum.photos/500"], direccion: {latitud:0,longitud:0}, telefono: "1231231231", idCreador: "asdasd", nombreCreador: "Nombre creador", raza: "la_raza" },{ id: "2", nombre: "Perro 2", fecha: Date.now()-Math.random()*50000000, descripcion: "Descripción 2", fotos: ["https://picsum.photos/501"], direccion: {latitud:0,longitud:0}, telefono: "0987654321", idCreador: "dos", nombreCreador: "Creador de la publicación", raza: "la_raza" },{ id: "3", nombre: "Perro 2", fecha: Date.now()-Math.random()*50000000, descripcion: "Descripción 2", fotos: ["https://picsum.photos/502"], direccion: {latitud:0,longitud:0}, telefono: "0987654321", idCreador: "dos", nombreCreador: "Creador de la publicación", raza: "la_raza" },
        { id: "4", nombre: "Perro 4", fecha: Date.now()-Math.random()*50000000, descripcion: "Descripción 2", fotos: ["https://picsum.photos/503"], direccion: {latitud:0,longitud:0}, telefono: "0987654321", idCreador: "dos", nombreCreador: "Creador de la publicación", raza: "la_raza" },
        { id: "5", nombre: "Perro 5", fecha: Date.now()-Math.random()*50000000, descripcion: "Descripción 2", fotos: ["https://picsum.photos/504"], direccion: {latitud:0,longitud:0}, telefono: "0987654321", idCreador: "dos", nombreCreador: "Creador de la publicación", raza: "la_raza" }];
        
        setPublicacionesSimilares(similares);
    }, [tipo, raza])

    return(
        <Card className="mb-8">
            <CardHeader>
                <h3 className="text-lg text-center font-bold mb-4">Posibles coincidencias de perros { tipo == "perdido" ? "encontrados" : "perdidos" }</h3>
                <div className="max-w-prose mx-auto">
                    <p className="flex items-center gap-2"><ScanSearch className="text-yellow-500" /> ¿Necesitas algo de ayuda impulsada por la IA?</p>
                    {
                        tipo == "perdido" ? (
                            <p className="flex items-center gap-2"><BotMessageSquare className="size-9 [transform:rotateY(180deg);]" /> Aquí podrías encontrar las publicaciones más recientes sobre perros similares.</p>
                        ) : (
                            <p className="flex items-center gap-2"><BotMessageSquare className="size-9 [transform:rotateY(180deg);]" /> Aquí podrías encontrar las publicaciones más recientes sobre perros similares para encontrar al dueño.</p>
                        )
                    }
                </div>
            </CardHeader>

            <CardContent>
                {
                    publicacionesSimilares === undefined ? (
                        <h3 className="text-center">Cargando...</h3>
                    ) : publicacionesSimilares.length > 0 ? (
                        <Swiper
                            className="w-full select-none"
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                  slidesPerView: 2,
                                  spaceBetween: 20,
                                },
                                768: {
                                  slidesPerView: 3,
                                  spaceBetween: 40,
                                },
                            }}
                            modules={[Navigation, Pagination, Keyboard, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            keyboard={{
                                enabled: true
                            }}
                            autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
                            loop={publicacionesSimilares.length > 1}
                        >
                            {
                                publicacionesSimilares.map(data => (
                                    <SwiperSlide>
                                        <CardPerro
                                            key={data.id}
                                            coleccion={tipo == "perdido" ? "encontrado" : "perdido"}
                                            data={data}
                                        />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    ) : (
                        <h3 className="text-center">No se encontraron coincidencias</h3>
                    )
                }
                <h4 className="text-lg font-bold text-red-500">TODO:</h4>
                <ol className="list-decimal list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:ml-4">
                    <li>
                        Al cargar la página, buscar los perros que coinciden con la raza "{raza}" (crear función buscarSimilares)
                        <ol>
                            <li>De más reciente a menos reciente</li>
                            <li>Recibe el tipo (el contrario de la publicación)</li>
                            <li>También recibe la raza del perro actual para buscar exactamente por esa raza</li>
                        </ol>
                    </li>
                </ol>
            </CardContent>
        </Card>
    )
}

export default SliderSimilares;