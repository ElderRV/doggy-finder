import { Link, useNavigate, useParams } from "react-router";
import { Edit, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import toast from "react-hot-toast";

interface AdministracionPublicacionProps {
    tipo: string;
    borrarPublicacion: (id: string) => Promise<void>;
}

function AdministracionPublicacion({ tipo, borrarPublicacion }: AdministracionPublicacionProps){
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBorrarPublicacion = async () => {
        if(!id) return;

        const promesa = borrarPublicacion(id);

        await toast.promise(promesa, {
            loading: "Borrando publicación...",
            success: "Publicación borrada",
            error: "Error al borrar la publicación"
        })
        // mostrar-perdidos - mostrar-encontrados
        navigate(`/mostrar-${tipo}s`);
    }

    return(
        <Card className="mx-auto my-8 max-w-prose">
            <CardHeader>
                <h2 className="font-bold text-xl">Administración</h2>
            </CardHeader>

            <CardContent className="flex gap-2 justify-end">
                <Link className={buttonVariants({ variant: "default" })} to={`/editar-${tipo}/${id}`}>
                    <Edit />
                    Editar
                </Link>
                <Button variant="destructive" onClick={handleBorrarPublicacion}>
                    <Trash2 />
                    Borrar
                </Button>
            </CardContent>
        </Card>
    )
}

export default AdministracionPublicacion;