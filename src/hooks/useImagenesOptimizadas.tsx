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
function useImagenesOptimizadas(opciones=opcionesOptimizacion) {
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

        const promesas = imagenes.map(async ({id, file: imagen}) => {    
            try{
                const imagenOptimizada = await imageCompression(imagen, {
                    ...opciones,
                    onProgress: (progress) => {
                        setImagenesOptimizadas(actuales => {
                            return actuales.map((img) => {
                                if(img.id === id){
                                    return {
                                        ...img,
                                        progreso: progress
                                    };
                                }
                                return img;
                            })
                        })
                    }
                });
                
                // Se sustituye la imagen original por la optimizada
                setImagenesOptimizadas(prev => prev.map((img) => {
                    if(img.id === id){
                        return {
                            ...img,
                            file: imagenOptimizada,
                            url: URL.createObjectURL(imagenOptimizada), // Crear URL para la imagen optimizada
                            progreso: 100 // Asegurarse de que llegó al 100%
                        }
                    }
                    return img;
                }))
            } catch(err){
                console.error(err);
                setImagenesOptimizadas(prev => prev.map((img) => {
                    if(img.id === id){
                        return {
                            ...img,
                            progreso: -1, // Error
                            url: URL.createObjectURL(imagen) // Crear URL para la imagen original
                        }
                    }
                    return img;
                }))
            }
        })

        await Promise.all(promesas);
    }

    const limpiarImagenes = () => {
        // Limpiar memoria
        imagenesOptimizadas.forEach((img) => {
            if(img.url){
                URL.revokeObjectURL(img.url); // Limpiar URL de la imagen optimizada
            }
        })

        // Limpiar el estado
        setImagenesOptimizadas([]);
    }

    const borrarImagen = (id: string) => {
        setImagenesOptimizadas(prev => prev.filter((img) => {
            // Limpiar memoria
            if(img.url){
                URL.revokeObjectURL(img.url); // Limpiar URL de la imagen optimizada
            }
            
            // Filtrar la imagen que se quiere borrar
            return img.id !== id
        }))
    }

    return {
        imagenesOptimizadas,
        optimizarImagenes,
        limpiarImagenes,
        borrarImagen
    }
}

export default useImagenesOptimizadas;