import { PublicacionEncontradoDB, PublicacionPerdidoDB } from "@/types";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { razaAFormato } from "@/lib/utils";

interface FiltrosPublicacionesProps {
    listaPublicaciones: PublicacionPerdidoDB[] | PublicacionEncontradoDB[] | undefined;
    setListaPublicacionesFiltradas: any;
}

function FiltrosPublicaciones({ listaPublicaciones, setListaPublicacionesFiltradas }: FiltrosPublicacionesProps){
    const [razas, setRazas] = useState<string[]>([]);
    const [razaSeleccionada, setRazaSeleccionada] = useState<string | undefined>("todas");

    useEffect(() => {
        if (listaPublicaciones) {
            const razas = [...new Set(listaPublicaciones.map(publicacion => publicacion.raza))];
            setRazas(razas);
        }
    }, [listaPublicaciones])

    const handleRaza = (valorSeleccionado: string) => {
        setRazaSeleccionada(valorSeleccionado);

        if (valorSeleccionado === "todas") {
            setListaPublicacionesFiltradas(listaPublicaciones);
        } else {
            setListaPublicacionesFiltradas(listaPublicaciones?.filter(publicacion => publicacion.raza === valorSeleccionado));
        }
    }

    return(
        <div className="flex items-center justify-center gap-4 mb-8">
            <label className="flex items-center gap-2">
                Filtrar por raza:

                <Select value={razaSeleccionada} onValueChange={handleRaza}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecciona una raza" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="todas">Todas</SelectItem>
                            {
                                razas.map((raza) => (
                                    <SelectItem value={raza} key={raza}>{razaAFormato(raza)}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </label>
        </div>
    )
}

export default FiltrosPublicaciones;