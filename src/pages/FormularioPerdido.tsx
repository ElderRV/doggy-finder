import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";

import SelectorDeUbicacion from "@/components/SelectorUbicacion";
import { TypeCoordenadas } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface FormularioPerdidoFormValues {
    nombre: string;
    descripcion: string;
    telefono: string;
    fotos: File[];
    direccion: TypeCoordenadas;
}

interface TypeFotoNueva {
    id: string;
    url: string;
    file: File;
}

type TypeFotosNuevas = TypeFotoNueva[];

function FormularioPerdido(){
    const { register, handleSubmit, formState, reset } = useForm<FormularioPerdidoFormValues>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            telefono: "",
            fotos: [],
        }
    });
    const [fotos, setFotos] = useState<TypeFotosNuevas>([]);
    const [coordenadas, setCoordenadas] = useState<TypeCoordenadas>({ longitud: -103, latitud: 21 });

    const onSubmit = ((data: FormularioPerdidoFormValues) => {
        let datos = {
            ...data,
            ...coordenadas
        }
        console.log(datos);

        reset();
    })

    // Mostrar la vista previa de las imágenes que se están subiendo
    const handleFoto = (e: any) => {
        const files = e.target.files;
        if(files.length <= 0) return;
        console.log(fotos);

        // Se crea la URL con el Blob para la previsualización
        let fotosNuevas: TypeFotosNuevas = [];
        for(let file of files){
            const url = URL.createObjectURL(file);

            fotosNuevas.push({
                id: Date.now()+file.name,
                url,
                file
            });
        }

        setFotos(prevFotos => [
            ...prevFotos,
            ...fotosNuevas 
        ])
    }

    const handleBorrarImagenLocal = (id: string) => {
        setFotos(prevFotos => [...prevFotos.filter(foto => foto.id !== id)]);
    }

    const handleCoordenadas = (e: any) => {
        setCoordenadas(e.target.value);
    }

    return(
        <main className="container mx-auto px-8 my-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-center font-bold text-3xl">¡Publica a tu perro para encontrarlo!</h1>

                {
                    fotos.length > 0 && (
                        <div className="m-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {
                                fotos.map(({id, url}) => (
                                    <div className="relative" key={id}>
                                        <img className="size-full object-cover" src={url} />
                                        <XIcon
                                            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-8 p-1 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
                                            onClick={() => handleBorrarImagenLocal(id)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                <Label className="flex flex-col gap-2">
                    <span>Fotografías <span className="text-red-500">*</span></span>
                    <div className={buttonVariants({ variant: "secondary", className: "cursor-pointer" })}>Elegir imágenes</div>
                    <Input
                        className="hidden"
                        {...register("fotos", {
                            required: {
                                value: true,
                                message: "Selecciona al menos una foto"
                            },
                            onChange: handleFoto
                        })}
                        type="file"
                        multiple
                        accept="image/*"
                    />
                    <span>
                        {fotos.length}
                        {fotos.length == 1 ? " imagen seleccionada" : " imágenes seleccionadas"}
                    </span>
                    {
                        formState.errors.fotos && (
                            <span className="text-sm text-red-500">{formState.errors.fotos.message}</span>
                        )
                    }
                </Label>

                <Label className="flex flex-col gap-2">
                    <span>Nombre <span className="text-red-500">*</span></span>
                    <Input {...register("nombre", {
                        required: {
                            value: true,
                            message: "El nombre es requerido"
                        }
                    })} type="text" />
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
                    <span>Número de teléfono <span className="text-red-500">*</span></span>
                    {/* // TODO: Cómo era el pattern? */}
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
                            // TODO: Regex que como máximo sea también 10, porque aquí solo me está aceptando el mínimo
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
                    <span>Ubicación <span className="text-red-500">*</span></span>
                    <SelectorDeUbicacion
                        className="mx-auto rounded-md"
                        name="direccion"
                        onInput={handleCoordenadas}
                        value={coordenadas}
                        // Para saber si se cambió de ruta entre publicar y editar
                        modoEdicion={false}
                    />
                </Label>

                <Button type="submit">Publicar</Button>
            </form>
        </main>
    )
}

export default FormularioPerdido;