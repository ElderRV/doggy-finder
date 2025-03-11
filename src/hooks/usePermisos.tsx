import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { obtenerRol } from "@/lib/utils";

/* Custom hook para obtener permisos globales (por rol), no maneja renderizado ni lógica específica por usuario, solo obtiene los valores de permisos de la base de datos */
function usePermisos(names: string[]){
    const { usuario, permisos } = useAuth()!;

    const [permiso, setPermiso] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const actualizarPermiso = () => {
        if(permisos && names.length > 0){
            const rol = obtenerRol(usuario);
    
            // Obtenemos los permisos de firebase (true o false), si no existe pone false por defecto
            // Si hay algún permiso que cumpla, entonces autoriza
            const autorizado = Array.isArray(names) ? names.map(name => permisos[rol]?.[name]) : [false];

            setPermiso(autorizado.includes(true));
    
            // Mensajes de error para mostrar si no tiene un permiso
            if(!usuario){
                // Si no tiene una sesión activa
                setError("Registrate o inicia sesión");
            } else {
                // Si no tiene los suficientes permisos
                setError("No tienes los permisos suficientes");
            }
        }
    }

    useEffect(() => {
        actualizarPermiso();
    }, [usuario, permisos])

    return { permiso, error };
}

export default usePermisos;