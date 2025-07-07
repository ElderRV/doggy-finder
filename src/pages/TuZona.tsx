import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import mapboxgl, { Map, Marker, Popup, FullscreenControl } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import { calcularDistancia, obtenerUbicacion } from "@/lib/utils";
import { obtenerPublicacionesEncontrados, obtenerPublicacionesPerdidos } from "@/firebase";
import { PublicacionEncontradoDB, PublicacionPerdidoDB } from "@/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface TypeProps {
    className?: string;
}

function TuZona({ className }: TypeProps){
    let mapaContenedor = useRef<string | HTMLElement | null>(null);
    const [mapa, setMapa] = useState<Map | null>(null);
    const [errorUbicacion, setErrorUbicacion] = useState(false);

    const [encontrados, setEncontrados] = useState<PublicacionPerdidoDB[]>([]);
    const [perdidos, setPerdidos] = useState<PublicacionEncontradoDB[]>([]);

    // Marcadores para la limpieza y actualización de estado
    const [marcadores, setMarcadores] = useState<Marker[]>([]);

    // Ubicacion y radio para filtrar las publicaciones
    const [ubicacionUsuario, setUbicacionUsuario] = useState<{ longitud: number, latitud: number } | null>(null);
    const [radioBusqueda, setRadioBusqueda] = useState<number>(5); // Radio de búsqueda en km

    // Se crea el mapa y se centra en la ubicación del usuario
    const cargarMapa = async () => {
        let { longitud, latitud } = await obtenerUbicacion() || {};

        if(longitud && latitud) setUbicacionUsuario({ longitud, latitud });

        if(!longitud || !latitud){
            toast.error("No se pudo obtener la ubicación del usuario.");
            setErrorUbicacion(true);
            return;
        }

        let map = new Map({
            container: mapaContenedor.current as HTMLElement,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [longitud, latitud],
            zoom: 15,
            attributionControl: false
        });

        // Controles para acercar, alejar y girar
        map.addControl(new mapboxgl.NavigationControl());

        // Controles para ir a la ubicación del usuario
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            }
        }));

        // Controles para pantalla completa
        map.addControl(new FullscreenControl({
            container: mapaContenedor.current as HTMLElement
        }))

        // Ubicación del usuario
        const popup = new Popup({ className:"text-black text-base", closeButton: false })
                    .setText(`Tu ubicación`);
        
        new Marker({ color: "#09f" })
        .setLngLat([longitud, latitud])
        .addTo(map)
        .setPopup(popup);

        setMapa(map);
    }

    // Actualizar el radio de búsqueda en el estado
    const handleRadio = (radio: string) => {
        setRadioBusqueda(parseInt(radio));
    }

    // Obtener publicaciones y cargar el mapa
    useEffect(() => {
        // Obtener las publicaciones
        obtenerPublicacionesEncontrados()
        .then(encontrados => setEncontrados(encontrados))
        
        obtenerPublicacionesPerdidos()
        .then(perdidos => setPerdidos(perdidos))

        cargarMapa();
    }, [])

    // Mostrar los marcadores de las publicaciones en el mapa
    useEffect(() => {
        if(!mapa) return;

        // Limpiar los marcadores anteriores
        marcadores.forEach(marker => marker.remove());

        // Se añaden los marcadores filtrados por radio
        perdidos
        .filter(({ direccion: { latitud: lat1, longitud: lon1 } }) => {
            if(!ubicacionUsuario) return true; // Si no hay ubicación del usuario, no filtrar
            return calcularDistancia(ubicacionUsuario.latitud, ubicacionUsuario.longitud, lat1, lon1) <= radioBusqueda;
        })
        .forEach(({ id, nombre, fotos, direccion: { latitud, longitud } }) => {
            const popup = new Popup({ className:"text-black text-base", closeButton: false })
                        .setHTML(`
                            <div>
                                <img src="${fotos[0]}" alt="${nombre}" />
                                <p class="font-bold">${nombre}</p>
                                <a class="text-sky-500" href="/mostrar-perdidos/${id}" target="_blank">Ver</a>
                            </div>    
                        `);

            const marker = new Marker({ color: "#f00" })
            .setLngLat([longitud, latitud])
            .addTo(mapa)
            .setPopup(popup);

            setMarcadores(prev => [...prev, marker]);
        })

        // Filtrar los encontrados por la ubicación del usuario
        encontrados
        .filter(({ direccion: { latitud: lat1, longitud: lon1 } }) => {
            if(!ubicacionUsuario) return true; // Si no hay ubicación del usuario, no filtrar
            return calcularDistancia(ubicacionUsuario.latitud, ubicacionUsuario.longitud, lat1, lon1) <= radioBusqueda;
        })
        .forEach(({ id, nombre, fotos, direccion: { latitud, longitud } }) => {
            const popup = new Popup({ className:"text-black text-base", closeButton: false })
                        .setHTML(`
                            <div>
                                <img src="${fotos[0]}" alt="${nombre}" />
                                <p class="font-bold">${nombre}</p>
                                <a class="text-sky-500" href="/mostrar-encontrados/${id}" target="_blank">Ver</a>
                            </div>    
                        `);

            const marker = new Marker({ color: "#0a0" })
            .setLngLat([longitud, latitud])
            .addTo(mapa)
            .setPopup(popup);

            setMarcadores(prev => [...prev, marker]);
        })
    }, [mapa, perdidos, encontrados, radioBusqueda])

    return(
        <main className="container mx-auto px-8 my-8 dark:text-slate-200">
            <h1 className="text-center font-bold text-3xl">Encuentra publicaciones en tu zona</h1>

            <div className="max-w-screen-md mx-auto my-4 dark:text-slate-200 text-center">
                <p>Encuentra las publicaciones cercanas de las personas que han perdido o encontrado un perro.</p>
            </div>

            {
                !errorUbicacion ? (
                    <div className="flex flex-col justify-center items-center gap-8 mt-16">
                        <Select value={radioBusqueda.toString()} onValueChange={handleRadio}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecciona una raza" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5 km</SelectItem>
                                    <SelectItem value="10">10 km</SelectItem>
                                    <SelectItem value="15">15 km</SelectItem>
                                    <SelectItem value="20">20 km</SelectItem>
                                    <SelectItem value="30">30 km</SelectItem>
                                    <SelectItem value="40">40 km</SelectItem>
                                    <SelectItem value="50">50 km</SelectItem>
                                    
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {
                            ubicacionUsuario === null && (<p>Obteniendo ubicación...</p>)
                        }
                        <div
                            className={className}
                            ref={mapaContenedor as React.LegacyRef<HTMLDivElement>}
                            style={{width: "90vmin", aspectRatio: "1/1"}}
                        />
                    </div>
                ):(
                    <div className="text-red-300 text-center mt-16">
                        <p>No se pudo obtener la ubicación del usuario. Asegúrate de que el navegador tenga permisos para acceder a la ubicación.</p>
                    </div>
                )
            }
        </main>
    )
}

export default TuZona;