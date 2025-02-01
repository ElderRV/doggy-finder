import { PublicacionEncontradoDB } from "@/types";
import CardPerro from "./CardPerro";
import { useEffect, useState } from "react";
import { obtenerPublicacionesEncontrados } from "@/firebase";

function ListaEncontrados(){
    const [listaEncontrados, setListaEncontrados] = useState<PublicacionEncontradoDB[] | undefined>(undefined);

    useEffect(() => {
        obtenerPublicacionesEncontrados()
        .then(setListaEncontrados)
    }, [])

    return(
        <section className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-8">
            {
                listaEncontrados === undefined ? (
                    <h3 className="col-span-full text-center my-4">Cargando...</h3>
                ) : listaEncontrados.length > 0 ? (
                    listaEncontrados.map(data => (
                        <CardPerro coleccion="encontrados" data={data} key={data.id} />
                    ))
                ) : (
                    <h3 className="col-span-full text-center my-4">No hay publicaciones</h3>
                )
            }
        </section>
    )
}

export default ListaEncontrados;