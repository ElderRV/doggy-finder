import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthProvider";
import { borrarComentario, enviarComentario, obtenerComentarios } from "@/firebase";

import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

import { Send, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader } from "./ui/card";

import { Comentario } from "@/types";

interface ComentarioForm {
    comentario: string;
}

function Comentarios(){
    const { id } = useParams();
    const { register, handleSubmit, formState, reset } = useForm<ComentarioForm>({
        defaultValues: {
            comentario: "",
        }
    });

    const { usuario } = useAuth()!;

    const [comentarios, setComentarios] = useState<Comentario[] | null>(null);

    // TODO: Obtener permisos por rol para permitir o proteger las acciones, usar un custom hook

    const handleEnviarComentario = async (data: ComentarioForm) => {
        if(!data.comentario) return toast.error("El comentario no puede estar vacío");
        // Si no existe el id de la publicación o el usuario, no se puede enviar el comentario
        if(!id || !usuario) return toast.error("Inicia sesión para poder comentar");

        // TODO: Si no tiene permisos para realizar esa acción
        
        // Se limpia el formulario
        reset();

        const promesa = enviarComentario({
            idPublicacion: id,
            idUsuario: usuario.uid,
            nombreUsuario: usuario?.displayName ?? "Anónimo",
            comentario: data.comentario
        })
        const comentario = await toast.promise(promesa, {
            loading: "Publicando comentario...",
            success: "Comentario publicado",
            error: (error) => error.message
        });

        // Agregar el comentario para mostrarlo en ese momento
        if(!comentario) return;
        setComentarios(comentarios => comentarios ? [...comentarios, comentario] : [comentario]);
    }

    const handleBorrarComentario = async (idComentario: string) => {
        toast.promise(borrarComentario(idComentario), {
            loading: "Borrando comentario...",
            success: "Comentario borrado",
            error: (error) => error.message
        });

        setComentarios(comentarios => comentarios ? comentarios.filter(comentario => comentario.id !== idComentario) : []);
    }

    useEffect(() => {
        if(!id) return;

        obtenerComentarios(id)
        .then(setComentarios);
    }, [id])

    return(
        <div>
            <h3 className="text-xl mb-2"><b>Comentarios</b></h3>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleEnviarComentario)}>
                <Label className="flex flex-col gap-2">
                    <span>Deja tu comentario:</span>
                    <Textarea
                        className="[field-sizing:content;]"
                        {...register("comentario")}
                        cols={30}
                        rows={2}
                    />
                    {
                        formState.errors.comentario && (
                            <span className="text-sm text-red-500">{formState.errors.comentario.message}</span>
                        )
                    }
                </Label>
                <Button className="self-end" type="submit">Enviar <Send /></Button>
            </form>

            <div className="my-4 space-y-4">
                {
                    comentarios === null ? (
                        <p>Cargando comentarios...</p>
                    ) : (
                        comentarios?.length === 0 ? (
                            <p>No hay comentarios</p>
                        ) : (
                            comentarios.map(({id, fecha, comentario, nombreUsuario: nombre}) => (
                                <Card className="flex flex-col" key={id}>
                                    <CardHeader>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <b>{nombre}</b>

                                            <small className="ml-auto">{ formatDistance(
                                                new Date(fecha),
                                                new Date(),
                                                {
                                                    addSuffix: true,
                                                    locale: es
                                                }
                                            ) }</small>

                                            {/* // TODO: Manejar los permisos protegiendo el boton de borar */}
                                            <Button variant="destructive" onClick={() => handleBorrarComentario(id)}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="break-words">{comentario}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    )
                }
            </div>
        </div>
    )
}

export default Comentarios;