import ListaPerdidos from "@/components/ListaPerdidos";

function BuscarPerdidos(){
    return(
        <main className="container mx-auto px-8 my-8 dark:text-slate-200">
            <h1 className="text-center font-bold text-3xl">Buscar perros perdidos</h1>

            <div className="max-w-screen-md mx-auto my-4 dark:text-slate-200 text-center">
                <p>Encuentra todas las publicaciones de las personas que han perdido un perro.</p>
                <p>Si encontraste uno, puedes buscarlo aquí para ayudar a su dueño.</p>
            </div>

            <ListaPerdidos />
        </main>
    )
}

export default BuscarPerdidos;