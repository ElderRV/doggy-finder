import { useEffect, useState } from "react";
import { obtenerPublicacionesPerdidos } from "@/firebase";
import { PublicacionPerdidoDB } from "@/types";

import FiltrosPublicaciones from "@/components/FiltrosPublicaciones";
import CardPerro from "@/components/CardPerro";

function ListaPerdidos(){
    const [listaPerdidos, setListaPerdidos] = useState<PublicacionPerdidoDB[] | undefined>(undefined);
    const [listaPublicacionesFiltradas, setListaPublicacionesFiltradas] = useState<PublicacionPerdidoDB[] | undefined>(undefined);

    useEffect(() => {
        obtenerPublicacionesPerdidos()
        .then(publicaciones => {
            setListaPerdidos(publicaciones);
            setListaPublicacionesFiltradas(publicaciones);
        })
    }, [])

    return(
        <section>
            <FiltrosPublicaciones listaPublicaciones={listaPerdidos} setListaPublicacionesFiltradas={setListaPublicacionesFiltradas} />

            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-8">
                {
                    listaPublicacionesFiltradas === undefined ? (
                        <h3 className="col-span-full text-center my-4">Cargando...</h3>
                    ) : listaPublicacionesFiltradas.length > 0 ? (
                        listaPublicacionesFiltradas.map(data => (
                            <CardPerro coleccion="perdidos" data={data} key={data.id} />
                        ))
                    ) : (
                        <h3 className="col-span-full text-center my-4">No hay publicaciones</h3>
                    )
                }
            </div>
        </section>
    )
}

export default ListaPerdidos;