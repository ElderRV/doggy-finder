import { borrarPublicacionEncontrado, obtenerPublicacionEncontrado } from "@/firebase";
import DescripcionPublicacion from "@/components/DescripcionPublicacion";

function DescripcionEncontrado(){
    return(
        <DescripcionPublicacion
            tipo="encontrado"
            obtenerPublicacion={obtenerPublicacionEncontrado}
            borrarPublicacion={borrarPublicacionEncontrado}
        />
    )
}

export default DescripcionEncontrado;