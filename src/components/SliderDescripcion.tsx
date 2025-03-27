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

import { PublicacionEncontradoDB, PublicacionPerdidoDB } from "@/types";

interface SliderDescripcionProps {
    publicacion: PublicacionPerdidoDB | PublicacionEncontradoDB;
}

function SliderDescripcion({ publicacion }: SliderDescripcionProps){
    return(
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
            loop={publicacion.fotos.length > 1}
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

export default SliderDescripcion;