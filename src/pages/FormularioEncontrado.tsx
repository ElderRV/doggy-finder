import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import useTitle from "@/hooks/useTitle";
import { useAuth } from "@/context/AuthProvider";
import useImagenesOptimizadas from "@/hooks/useImagenesOptimizadas";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SelectorDeUbicacion from "@/components/SelectorUbicacion";
import ImagenFormulario from "@/components/ImagenFormulario";

import { Textarea } from "@/components/ui/textarea";
import { crearPublicacionEncontrado, editarPublicacionEncontrado, obtenerPublicacionEncontrado } from "@/firebase";
import { PublicacionEncontradoForm, Coordenadas } from "@/types";

function FormularioEncontrado(){
    const { usuario } = useAuth()!;
    const { id } = useParams();

    const { register, handleSubmit, formState, reset } = useForm<PublicacionEncontradoForm>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            telefono: "",
        }
    });
    const [fotosDB, setFotosDB] = useState<{url: string, borrar: boolean}[]>([]);
    const [coordenadas, setCoordenadas] = useState<Coordenadas>({ longitud: -103, latitud: 21 });
    const { imagenesOptimizadas: fotos, optimizarImagenes, limpiarImagenes, borrarImagen: handleBorrarImagenLocal } = useImagenesOptimizadas();
    const [titulo, setTitulo] = useState("Publicar encontrado | DoggyFinder");

    const navigate = useNavigate();

    useTitle(titulo);

    const onSubmit = async (data: PublicacionEncontradoForm) => {
        if(!usuario) return;
        
        if(!id){
            //? Si no hay ID, se está creando una nueva publicación
            // Si no hay imagenes seleccionadas, se muestra un error
            if(fotos.length <= 0){
                toast.error("Selecciona al menos una foto");
                return;
            }

            let datos = {
                idCreador: usuario.uid,
                nombreCreador: usuario.displayName ?? "Anónimo",
                // @ts-expect-error No importa que se sobreescriba la dirección
                direccion: coordenadas, // Sobreescribir la dirección
                fotos: fotos.map(foto => foto.file),
                ...data,
            }
            const promesa = crearPublicacionEncontrado(datos);
            await toast.promise(promesa, {
                loading: "Publicando perro encontrado...",
                success: "Perro encontrado publicado",
                error: error => error.message ?? "Hubo un error al publicar el perro encontrado"
            })
        } else {
            //? Si hay ID, se está editando una publicación
            // Si no hay imagenes seleccionadas y no hay actuales, se muestra un error
            if(fotos.length <= 0 && fotosDB.filter(foto => !foto.borrar).length <= 0){
                toast.error("Selecciona al menos una foto");
                return;
            }
            let datos = {
                // Indica cuales fotos se van a borrar y cuales se van a mantener
                fotosDB: fotosDB,
                // @ts-expect-error No importa que se sobreescriba la dirección
                direccion: coordenadas, // Sobreescribir la dirección
                fotos: fotos.map(foto => foto.file), // Fotos nuevas
                ...data,
            }
            const promesa = editarPublicacionEncontrado(id, datos);
            await toast.promise(promesa, {
                loading: "Editando perro encontrado...",
                success: "Perro encontrado editado",
                error: error => error.message ?? "Hubo un error al editar el perro encontrado"
            })
        }

        navigate("/buscar-encontrados");
    }

    // Mostrar la vista previa de las imágenes que se están subiendo
    const handleFoto = async (e: any) => {
        const files: File[] = e.target.files;

        // Si no se suben fotos, se limpia el estado
        // para que coincida el estado del input y los blobs de las imagenes
        if(files.length <= 0) return limpiarImagenes();

        // Empezar a optimizar todos los archivos obtenidos
        optimizarImagenes([...files].map(file => ({
            id: Date.now() + file.name,
            file
        })));
    }

    const handleBorrarImagenDB = (url: string) => {
        setFotosDB(prevFotos => [...prevFotos.map(foto => foto.url === url ? {url, borrar: true} : foto)]);
    }

    const handleCoordenadas = (e: any) => {
        setCoordenadas(e.target.value);
    }

    // Si se está editando, se obtienen los datos de la publicación
    useEffect(() => {
        if(!id) return;

        setTitulo("Editar encontrado | DoggyFinder");

        obtenerPublicacionEncontrado(id)
        .then(datos => {
            reset({
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                telefono: datos.telefono
            })
            setCoordenadas(datos.direccion);
            setFotosDB(datos.fotos.map(url => ({url, borrar: false})));
        })
    }, [id])

    return(
        <main className="container mx-auto px-8 my-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-center font-bold text-3xl">¡Publica al perro que encontraste!</h1>

                {
                    fotosDB.filter(foto => !foto.borrar).length > 0 && (
                        <div>
                            <h2 className="font-bold text-xl">Imágenes actuales</h2>
                            <div className="m-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,100px),1fr))] gap-4">
                                {
                                    fotosDB.map(({url, borrar}, index) => (
                                        !borrar && (
                                            <ImagenFormulario
                                                key={index}
                                                src={url}
                                                handleBorrar={() => handleBorrarImagenDB(url)}
                                            />
                                        )
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    fotos.length > 0 && (
                        <div>
                            <h2 className="font-bold text-xl">Imágenes actuales</h2>

                            <div className="m-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,100px),1fr))] gap-4">
                                {
                                    fotos.map(({id, url, progreso}) => (
                                        <ImagenFormulario
                                            key={id}
                                            src={url}
                                            progreso={progreso}
                                            handleBorrar={() => handleBorrarImagenLocal(id)}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                <Label className="flex flex-col gap-2">
                    <span>Fotografías <span className="text-red-500">*</span></span>
                    <div className={buttonVariants({ variant: "secondary", className: "cursor-pointer" })}>Elegir imágenes</div>
                    <Input
                        className="hidden"
                        onChange={handleFoto}
                        type="file"
                        multiple
                        accept="image/*"
                    />
                    <span>
                        {fotos.length}
                        {fotos.length == 1 ? " imagen seleccionada" : " imágenes seleccionadas"}
                    </span>
                </Label>

                <Label className="flex flex-col gap-2">
                    <span>Nombre o distintivo (opcional)</span>
                    <Input {...register("nombre")} type="text" />
                    {
                        formState.errors.nombre && (
                            <span className="text-sm text-red-500">{formState.errors.nombre.message}</span>
                        )
                    }
                </Label>

                <Label className="flex flex-col gap-2">
                    <span>Descripción <span className="text-red-500">*</span></span>
                    <Textarea
                        className="[field-sizing:content;]"
                        {...register("descripcion", {
                            required: {
                                value: true,
                                message: "La descripción es requerida"
                            }
                        })}
                    />
                    {
                        formState.errors.descripcion && (
                            <span className="text-sm text-red-500">{formState.errors.descripcion.message}</span>
                        )
                    }
                </Label>

                <Label className="flex flex-col gap-2">
                    <span>Número de teléfono para contactárte <span className="text-red-500">*</span></span>
                    <Input {...register("telefono", {
                        required: {
                            value: true,
                            message: "El número de teléfono es requerido"
                        },
                        minLength: {
                            value: 10,
                            message: "Introduce 10 dígitos"
                        },
                        maxLength: {
                            value: 10,
                            message: "Introduce 10 dígitos"
                        },
                        pattern: {
                            value: /\d{10}/,
                            message: "Introduce 10 dígitos"
                        }
                    })} type="text" />
                    {
                        formState.errors.telefono && (
                            <span className="text-sm text-red-500">{formState.errors.telefono.message}</span>
                        )
                    }
                </Label>

                <Label className="flex flex-col gap-2">
                    <span>Ubicación del lugar donde se encontró <span className="text-red-500">*</span></span>
                    <SelectorDeUbicacion
                        className="mx-auto rounded-md"
                        name="direccion"
                        onInput={handleCoordenadas}
                        value={coordenadas}
                        // Para saber si se cambió de ruta entre publicar y editar
                        modoEdicion={false}
                    />
                </Label>

                <Button type="submit">{!id ? "Publicar" : "Editar"}</Button>
            </form>
        </main>
    )
}

export default FormularioEncontrado;