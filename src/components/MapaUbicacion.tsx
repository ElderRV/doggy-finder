import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapaUbicacion({ className="", ubicacion={longitud: 0, latitud: 0} }){
    let mapaContenedor = useRef<string | HTMLElement | null>(null);
    const [mapa, setMapa] = useState<Map | null>(null);
    const [marker, setMarker] = useState<Marker | null>(null);

    useEffect(() => {
        const { longitud, latitud } = ubicacion;

        const map = new Map({
            container: mapaContenedor.current as HTMLElement,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [longitud, latitud],
            zoom: 15,
            attributionControl: false
        });

        const marker = new Marker({ color: "#f00" })
        .setLngLat([longitud, latitud])
        .addTo(map);

        map.addControl(new mapboxgl.NavigationControl());

        setMapa(map);
        setMarker(marker);
    }, [])

    // Cuando cambia la ubicación se actualiza la posición
    // Para cuando se cambia de ruta
    useEffect(() => {
        if(!mapa || !marker) return;

        const { longitud, latitud } = ubicacion;

        mapa.setCenter([longitud, latitud]);
        marker.setLngLat([longitud, latitud]);
    }, [mapa, marker, ubicacion])

    return(
        // Estilos temporales
        <div ref={mapaContenedor as React.LegacyRef<HTMLDivElement>} className={`w-[90%] max-w-lg aspect-square ${className}`} />
    )
}

export default MapaUbicacion;