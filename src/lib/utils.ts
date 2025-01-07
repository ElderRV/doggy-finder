import { TypeCoordenadas } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function obtenerUbicacion(): Promise<TypeCoordenadas | null> {
    return await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(geolocation => {
            const { longitude: longitud, latitude: latitud } = geolocation.coords;

            res({ longitud, latitud });
        }, () => {
            res(null);
        })
    })
}