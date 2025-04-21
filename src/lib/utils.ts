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

export async function obtenerRaza(fotosUrls: string[]): Promise<string> {
    const promises = fotosUrls.map(async url => {
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BREED_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url
                })
            });
            const data = await res.json();

            if(data.error) return "Desconocida";

            return data.breed;
        } catch(err){
            console.error(err);
            return "Desconocida";
        }
    })
    
    const razas = await Promise.all(promises);

    // Se obtiene la raza más común
    const frecuencias = razas.reduce((acc: { [key: string]: number }, raza) => {
        acc[raza] = (acc[raza] || 0) + 1;
        return acc;
    }, {});

    const arrayFrecuencias = Object.entries(frecuencias);
    const raza = [...arrayFrecuencias].sort((a, b) => b[1] - a[1])[0][0];

    return raza;
}

interface IncluyePerroResultado {
    url: string;
    includes_dog: boolean;
}

export async function incluyePerro(fotosUrls: string[]): Promise<IncluyePerroResultado[]> {
    const promises = fotosUrls.map(async url => {
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_SEARCH_DOG_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url
                })
            });
            const data = await res.json();

            return {
                url: url,
                includes_dog: data.includes_dog
            } as IncluyePerroResultado;
        } catch(err){
            console.error(err);
            return {
                url: url,
                includes_dog: false
            } as IncluyePerroResultado;
        }
    })

    const resultados = await Promise.all(promises);
    
    return resultados;
}

interface IncluyeNSFWResultado {
    url: string;
    nsfw: boolean;
}

export async function incluyeNSFW(fotosUrls: string[]): Promise<IncluyeNSFWResultado[]> {
    const promises = fotosUrls.map(async url => {
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_NSFW_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url
                })
            });
            const data = await res.json();

            if(data.error) throw new Error(data.message);

            return {
                url: url,
                nsfw: data.nsfw
            } as IncluyeNSFWResultado;
        } catch(err){
            console.error(err);
            return {
                url: url,
                nsfw: true // Si no se puede verificar, se asume que es NSFW para evitar problemas
            } as IncluyeNSFWResultado;
        }
    })

    const resultados = await Promise.all(promises);
    
    return resultados;
}