import { borrarPublicacionPerdido, obtenerPublicacionPerdido } from "@/firebase";
import DescripcionPublicacion from "@/components/DescripcionPublicacion";

function DescripcionPerdido(){
    return(
        <DescripcionPublicacion
            tipo="perdido"
            obtenerPublicacion={obtenerPublicacionPerdido}
            borrarPublicacion={borrarPublicacionPerdido}
        />
    )
}

export default DescripcionPerdido;