import { useEffect, useState } from "react";
import { obtenerPublicacionesEncontrados } from "@/firebase";
import { PublicacionEncontradoDB } from "@/types";

import FiltrosPublicaciones from "@/components/FiltrosPublicaciones";
import CardPerro from "@/components/CardPerro";

function ListaEncontrados(){
    const [listaEncontrados, setListaEncontrados] = useState<PublicacionEncontradoDB[] | undefined>(undefined);
    const [listaPublicacionesFiltradas, setListaPublicacionesFiltradas] = useState<PublicacionEncontradoDB[] | undefined>(undefined);

    useEffect(() => {
        obtenerPublicacionesEncontrados()
        .then(publicaciones => {
            setListaEncontrados(publicaciones);
            setListaPublicacionesFiltradas(publicaciones);
        })
    }, [])

    return(
        <section>
            <FiltrosPublicaciones listaPublicaciones={listaEncontrados} setListaPublicacionesFiltradas={setListaPublicacionesFiltradas} />

            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-8">
                {
                    listaPublicacionesFiltradas === undefined ? (
                        <h3 className="col-span-full text-center my-4">Cargando...</h3>
                    ) : listaPublicacionesFiltradas.length > 0 ? (
                        listaPublicacionesFiltradas.map(data => (
                            <CardPerro coleccion="encontrados" data={data} key={data.id} />
                        ))
                    ) : (
                        <h3 className="col-span-full text-center my-4">No hay publicaciones</h3>
                    )
                }
            </div>
        </section>
    )
}

export default ListaEncontrados;