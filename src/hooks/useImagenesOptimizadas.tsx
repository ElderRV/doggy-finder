import { useState } from "react";
import imageCompression from "browser-image-compression";

import { FotosOptimizadas } from "@/types";

const opcionesOptimizacion = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
    preserveExif: false,
    fileType: "image/webp"
}

interface ImagenesForm {
    id: string;
    file: File;
}

// Custom hook para optimizar imagenes y regresar sus estados
function useImagenesOptimizadas() {
    const [imagenesOptimizadas, setImagenesOptimizadas] = useState<FotosOptimizadas>([]);

    const optimizarImagenes = async (imagenes: ImagenesForm[]) => {
        // Para cada imagen, creamos un objeto con el progreso y el file
        // Hacemos un append para no perder las imagenes anteriores
        setImagenesOptimizadas(prev => (
            [
                ...prev,
                ...imagenes.map(({id, file}) => ({
                    id,
                    progreso: 0,
                    file,
                    url: ""
                }))
            ]
        ))

        imagenes.forEach(async ({id, file: imagen}) => {    
            try{
                const imagenOptimizada = await imageCompression(imagen, {
                    ...opcionesOptimizacion,
                    onProgress: (progress) => {
                        setImagenesOptimizadas(actuales => {
                            return actuales.map((img) => {
                                if(img.id === id){
                                    img.progreso = progress;
                                }
                                return img;
                            })
                        })
                    }
                });
                setImagenesOptimizadas(prev => prev.map((img) => {
                    if(img.id === id){
                        img.file = imagenOptimizada;
                        img.url = URL.createObjectURL(imagenOptimizada); // Crear URL para la imagen optimizada
                        img.progreso = 100; // Asegurarse de que llegó al 100%
                    }
                    return img;
                }))
            } catch(err){
                console.error(err);
                setImagenesOptimizadas(prev => prev.map((img) => {
                    if(img.id === id){
                        img.progreso = -1; // Error
                        img.url = URL.createObjectURL(imagen);
                    }
                    return img;
                }))
            }
        })
    }

    const limpiarImagenes = () => {
        setImagenesOptimizadas([]);
    }

    const borrarImagen = (id: string) => {
        setImagenesOptimizadas(prev => prev.filter((img) => img.id !== id))
    }

    return {
        imagenesOptimizadas,
        optimizarImagenes,
        limpiarImagenes,
        borrarImagen
    }
}

export default useImagenesOptimizadas;