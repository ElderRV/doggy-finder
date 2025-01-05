import { useAuth } from "@/context/AuthProvider";

function Inicio(){
    // Obtener los datos desde useAuth
    // Y arreglar "La propiedad 'usuario' no existe en el tipo 'AuthProviderValue | null'
    const { usuario } = useAuth()!;

    return(
        <main className="container mx-auto px-8 my-8">
            <p>Hola {usuario?.displayName || "anónimo"}</p>
            <img src={usuario?.photoURL!} alt={`Imagen de ${usuario?.displayName}`} />
            <h1 className="text-center font-bold text-3xl">DoggyFinder</h1>
            <p>DoggyFinder es una aplicación web que te permite encontrar a tu mejor amigo.</p>
        </main>
    )
}

export default Inicio;