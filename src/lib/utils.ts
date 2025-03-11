import { AuthUser, Coordenadas, Roles } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const PERMISOS = {
    "admin": {
        "general/crear-publicacion": true,
        "general/administrar-publicacion": true,
        "general/comentar-publicacion": true,
        "general/borrar-comentario": true,
        "personal:publicacion/administrar-publicacion": true,
        "personal:comentario/borrar-comentario": true,
    },
    "usuario": {
        "general/crear-publicacion": true,
        "general/administrar-publicacion": false,
        "general/comentar-publicacion": true,
        "general/borrar-comentario": false,
        "personal:publicacion/administrar-publicacion": true,
        "personal:comentario/borrar-comentario": true,
    },
    "anonimo": {
        "general/crear-publicacion": false,
        "general/administrar-publicacion": false,
        "general/comentar-publicacion": false,
        "general/borrar-comentario": false,
        "personal:publicacion/administrar-publicacion": false,
        "personal:comentario/borrar-comentario": false,
    }
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function obtenerUbicacion(): Promise<Coordenadas | null> {
    return await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(geolocation => {
            const { longitude: longitud, latitude: latitud } = geolocation.coords;

            res({ longitud, latitud });
        }, () => {
            res(null);
        })
    })
}

export function obtenerRol(usuario: AuthUser): Roles{
    // Se obtiene el rol del usuario actual
    let rol = usuario?.rol ?? "anonimo"; // (admin o usuario, si no existe, es anonimo)

    return rol;
}