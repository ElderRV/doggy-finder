import { useEffect, useState } from "react";
import { BotMessageSquare, ScanSearch } from "lucide-react";

import { buscarPerrosSimilares } from "@/firebase";

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

function SliderSimilares({ tipo, raza="Desconocida" }: SliderSimilaresProps){
    const [publicacionesSimilares, setPublicacionesSimilares] = useState<PublicacionEncontradoDB[] | PublicacionPerdidoDB[] | undefined>(undefined);

    useEffect(() => {
        if(!tipo || !raza) return setPublicacionesSimilares([]);

        // Se buscan perros similares dependiendo del tipo de la publicación actual y de la raza
        buscarPerrosSimilares(tipo, raza)
        .then(similares => {
            setPublicacionesSimilares(similares);
        })
    }, [tipo, raza])

    return(
        <Card className="mb-8">
            <CardHeader>
                <h3 className="text-lg text-center font-bold mb-4">Posibles coincidencias de perros { tipo == "perdido" ? "encontrados" : "perdidos" }</h3>
                <div className="max-w-prose mx-auto">
                    <p className="flex items-center gap-3"><ScanSearch className="text-yellow-500" /> ¿Necesitas algo de ayuda impulsada por la IA?</p>
                    {
                        tipo == "perdido" ? (
                            <p className="flex items-center gap-3"><BotMessageSquare className="flex-shrink-0 [transform:rotateY(180deg);]" /> Aquí podrías encontrar las publicaciones más recientes sobre perros similares.</p>
                        ) : (
                            <p className="flex items-center gap-3"><BotMessageSquare className="flex-shrink-0 [transform:rotateY(180deg);]" /> Aquí podrías encontrar las publicaciones más recientes sobre perros similares para encontrar al dueño.</p>
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
            </CardContent>
        </Card>
    )
}

export default SliderSimilares;