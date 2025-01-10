import { PublicacionPerdidoDB } from "@/types";
import CardPerro from "./CardPerro";

function ListaPerdidos(){
    const listaPerdidos: PublicacionPerdidoDB[] = [
        {
            id: "id",
            idCreador: "idCreador",
            nombreCreador: "Fulanita",
            nombre: "Nombre del perro",
            descripcion: "Descripción del perro",
            telefono: "1231231231",
            direccion: { longitud: 123, latitud: 123 },
            fotos: ["/hero.webp", "/hero.webp"]
        },
        {
            id: "id2",
            idCreador: "idCreador2",
            nombreCreador: "Fulanito Pérez",
            nombre: "Nombre del perro2",
            descripcion: "Descripción del perro2",
            telefono: "1231231232",
            direccion: { longitud: 100, latitud: 100 },
            fotos: ["/hero.webp", "/hero.webp"]
        }
    ];
    return(
        <section className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-8">
            {
                listaPerdidos === undefined ? (
                    <h3 className="text-center my-4">Cargando...</h3>
                ) : listaPerdidos.length > 0 ? (
                    listaPerdidos.map(data => (
                        <CardPerro data={data} />
                    ))
                ) : (
                    <h3 className="text-center my-4">No hay publicaciones</h3>
                )
            }
        </section>
    )
}

export default ListaPerdidos;