import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';

import { useAuth } from "../context/AuthProvider";
import { obtenerComentario, obtenerPublicacionPerdido, obtenerPublicacionEncontrado } from "../firebase";
import { obtenerRol } from "@/lib/utils";


interface ProtegidoProps {
    names: string[];
    type: "route" | "component";
    redirect: string;
    paramURL: string;
    params: Record<string, string>;
    cargandoComponent: React.ReactNode;
    errorComponent: React.ReactNode;
    children: React.ReactNode;
}

/*
    names - arreglo con los nombres de permisos o acciones
    type ("route", "component") - Si se protege una ruta, redirige a otro lugar, si se protege un componente, simplemente no lo muestra
    redirect - Ruta a donde redirige si no se tienen los permisos
    paramURL - Parametro de la url para comparar con la id del usuario y establecer permisos
    params - Para pasarle parametros extra para realizar operaciones como en el permiso de "comentario/"
*/
const permisoDefault = false;
function Protegido({
    names,
    type="route",
    redirect="/", // se usa en route
    paramURL="id", // se usa en route y component
    params={}, // se usa en route y component
    cargandoComponent=<span className="block text-center text-xl">Cargando...</span>,
    errorComponent=<span className="block text-center text-xl">No tienes los permisos suficientes</span>,
    children
}: Partial<ProtegidoProps>){
    const paramsURL = useParams();
    // Parametro para comparar con el id del usuario
    // Por defecto busca id y si no, busca el parametro que se pase, por ejemplo :id, :etc
    const parametroURL = paramsURL[paramURL];

    const { usuario, permisos } = useAuth()!;
    const navigate = useNavigate();

    const [cargando, setCargando] = useState<boolean>(true);
    const [autorizado, setAutorizado] = useState<boolean>(permisoDefault);

    const procesarPermisos = async () => {
        setCargando(true);

        //? ROL
        const rol = obtenerRol(usuario);

        //? LÓGICA DE PERMISOS
        // Obtenemos los permisos de firebase (true o false), si no existe pone permisoDefault por defecto
        // Si hay algún permiso que cumpla, entonces autoriza (permiso de usuario o por rol)
        let arrayAutorizacion = Array.isArray(names) ? names.map(async (name) => {
            if(name.startsWith("general/")){
                // Si el tipo de permiso es en general, se compara por el rol
                return permisos[rol]?.[name];
            } else if(name.startsWith("personal:publicacion/")) {
                // Si se tiene que proteger una publicación para que solo acceda el creador
                // La id de la publicación se puede obtener por la url o por params
                if(!parametroURL && !params.id){
                    console.error('No se ha pasado el parametro "id" en el prop params o la key "id" en el prop paramURL');
                    return false;
                };
                if(!params.coleccion){
                    console.error('No se ha pasado el parametro "coleccion" en el prop params');
                    return false;
                }
                
                let publicacion;
                if(params.coleccion == "perdidos") publicacion = await obtenerPublicacionPerdido(parametroURL ?? params.id);
                else publicacion = await obtenerPublicacionEncontrado(parametroURL ?? params.id);

                return permisos[rol]?.[name] && publicacion.idCreador == usuario?.id;
            } else if(name.startsWith("personal:comentario/")) {
                // Si solo el dueño del usuario puede hacer un cambio con su propio comentario
                // Se necesita un params con { idComentario: ... }
                // No se puede con la url porque el idComentario no tiene su propia ruta
                if(!params.idComentario){
                    console.error('No se ha pasado el parametro "idComentario" en el prop params');
                    return false;
                }

                const comentario = await obtenerComentario(params.idComentario);
                return permisos[rol]?.[name] && comentario.idUsuario == usuario?.id;
            } else {
                return permisos[rol]?.[name];
            }
        }) : [permisoDefault];

        let autorizado = (await Promise.all(arrayAutorizacion)).includes(true);

        // Actualizamos el estado para el renderizado
        setAutorizado(autorizado);

        // Acciones si no está autorizado
        if(!autorizado && type == "route"){
            // Si es una ruta, redirige a otra ruta
            navigate(redirect);

            if(!usuario){
                // Si no tiene una sesión activa
                toast.error("Registrate o inicia sesión");
            } else {
                // Si no tiene los suficientes permisos
                toast.error("No tienes los permisos suficientes");
            }
        }

        setCargando(false);
    }

    useEffect(() => {
        if(usuario === undefined || !permisos) return;
        
        // Cuando ya se hayan obtenido los permisos y el usuario
        procesarPermisos();
    }, [usuario, permisos])

    // Manejar la renderización, cuando hay error y se tiene type="route" no renderiza nada porque tiene que redirigir
    if(cargando){
        return cargandoComponent;
    } else if(!autorizado && type == "component"){
        return errorComponent;
    } else if(autorizado){
        // Si el usuario tiene permisos muestra todo normal
        return children;
    }
}

export default Protegido;