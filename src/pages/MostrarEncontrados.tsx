import ListaEncontrados from "@/components/ListaEncontrados";

function MostrarEncontrados(){
    return(
        <main className="container mx-auto px-8 my-8 dark:text-slate-200">
            <h1 className="text-center font-bold text-3xl">Mostrar perros encontrados</h1>

            <div className="max-w-screen-md mx-auto my-4 dark:text-slate-200 text-center">
                <p>Encuentra todas las publicaciones de las personas que han encontrado un perro.</p>
                <p>Si perdiste uno, puedes buscarlo aquí.</p>
            </div>

            <ListaEncontrados />
        </main>
    )
}

export default MostrarEncontrados;