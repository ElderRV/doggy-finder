import { useEffect, useRef, useState } from "react";

import mapboxgl, { LngLat, Map, Marker } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import { obtenerUbicacion } from "@/lib/utils";
import { TypeCoordenadas } from "@/types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface TypeProps {
    name: string;
    value: TypeCoordenadas;
    onInput: (prop: any) => any;
    modoEdicion: boolean;
    className: string;
    [key: string]: any;
}

function SelectorDeUbicacion({
    name,
    value,
    onInput: handleInput,
    modoEdicion,
    className
}: TypeProps){
    let mapaContenedor = useRef<string | HTMLElement | null>(null);
    const [mapa, setMapa] = useState<Map | null>(null);
    const [marker, setMarker] = useState<Marker | null>(null);

    const [actualizado, setActualizado] = useState(false);

    // Se utiliza para decidir si se usa la geolocalización o los datos de value
    // Cuando carga la página o cuando se cambia de ruta
    const calcularCoordenadasActualizacion = async () => {
        // Se obtienen las coordenadas desde los datos de la publicación para actualizar la posición       
        let { longitud, latitud } = value;

        // Cuando se está publicando, se intenta obtener la ubicación
        if(!modoEdicion){
            let coords = await obtenerUbicacion();

            longitud = coords?.longitud || longitud;
            latitud = coords?.latitud || latitud;
        }

        return { longitud, latitud };
    }

    const handleMove = () => marker?.setLngLat(mapa?.getCenter() as LngLat);
    const handleMoveEnd = () => {
        let {lng: longitud, lat: latitud} = mapa?.getCenter()!;

        // Se simula un evento y se cambia el estado
        handleInput({
            target: {
                name,
                value: { longitud, latitud }
            }
        })
    }
    
    // Solo la primera vez se crea y configura el mapa y el marcador
    const cargarMapa = async () => {
        let { longitud, latitud } = await calcularCoordenadasActualizacion();

        let map = new Map({
            container: mapaContenedor.current as HTMLElement,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [longitud, latitud],
            zoom: 15,
            attributionControl: false
        });

        const marker = new Marker({ color: "#f00" })
        .setLngLat([longitud, latitud])
        .addTo(map);

        // Controles para acercar, alejar y girar
        map.addControl(new mapboxgl.NavigationControl());

        // Controles para ir a la ubicación del usuario
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            }
        }));

        setMapa(map);
        setMarker(marker);
    }

    // Cuando se edita el value y ya existe el mapa se quitan los posibles eventos y se actualiza la posición
    // Para evitar enviar el estado y hacer un ciclo infinito
    const actualizarPosicionMapa = async () => {
        // Se quitan los eventos para evitar que se modifique el estado
        mapa?.off("move", handleMove);
        mapa?.off("moveend", handleMoveEnd);
        
        if(value) mapa?.setCenter([value.longitud, value.latitud]);
        marker?.setLngLat(mapa?.getCenter() as LngLat);

        // Ya que se actualiza, se vuelven a poner los eventos
        setActualizado(true);
    }

    // Cuando ya está actualizado, solo si ya hay value, se vuelven a poner los eventos
    const agregarEventos = () => {
        mapa?.on("move", handleMove);
        mapa?.on("moveend", handleMoveEnd);

        // Después de poner los eventos se reinicia el estado para poder mover de nuevo
        setActualizado(false);
    }

    useEffect(() => {
        cargarMapa();
    }, [])

    // Al cambiar de ruta
    useEffect(() => {
        if(mapa){
            // Se actualiza la posición del mapa pero con las coordenadas dependiendo de la ruta
            mapa.off("move", handleMove);
            mapa.off("moveend", handleMoveEnd);

            calcularCoordenadasActualizacion()
            .then(({ longitud, latitud}) => {
                mapa.setCenter([longitud, latitud]);
                marker?.setLngLat(mapa.getCenter());
            })

            // Ya que se actualiza, se vuelven a poner los eventos
            setActualizado(true);
        }
    }, [mapa, modoEdicion])
    
    // Al cambiar el value
    useEffect(() => {
        if(mapa && value && !actualizado) actualizarPosicionMapa();
    }, [mapa, value])

    useEffect(() => {
        if(actualizado) agregarEventos();
    }, [actualizado])

    return(
        // Estilos temporales
        <div
            className={className}
            ref={mapaContenedor as React.LegacyRef<HTMLDivElement>}
            style={{width: "90%", maxWidth: "500px", aspectRatio: "1/1"}}
        />
    )
}

export default SelectorDeUbicacion;