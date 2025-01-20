import { PublicacionPerdidoDB } from "@/types";
import CardPerro from "./CardPerro";
import { useEffect, useState } from "react";
import { obtenerPublicacionesPerdidos } from "@/firebase";

function ListaPerdidos(){
    const [listaPerdidos, setListaPerdidos] = useState<PublicacionPerdidoDB[] | undefined>(undefined);

    useEffect(() => {
        obtenerPublicacionesPerdidos()
        .then(setListaPerdidos)
    }, [])

    return(
        <section className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-8">
            {
                listaPerdidos === undefined ? (
                    <h3 className="col-span-full text-center my-4">Cargando...</h3>
                ) : listaPerdidos.length > 0 ? (
                    listaPerdidos.map(data => (
                        <CardPerro data={data} key={data.id} />
                    ))
                ) : (
                    <h3 className="col-span-full text-center my-4">No hay publicaciones</h3>
                )
            }
        </section>
    )
}

export default ListaPerdidos;