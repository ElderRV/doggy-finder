import { XIcon } from "lucide-react";

interface ImagenFormularioProps {
    src: string;
    progreso?: number;
    handleBorrar: any;
}

function ImagenFormulario({ src, progreso=0, handleBorrar }: ImagenFormularioProps){
    if(!src){
        return (
            <div className="relative size-full flex flex-col items-center justify-center text-center">
                <div className="size-10 rounded-full border-4 border-gray-500 border-t-gray-200 animate-spin"></div>
                <span>Optimizando: {progreso}%</span>
            </div>
        )
    }

    return(
        <div className="relative size-full">
            <img className="size-full object-cover" src={src} />
            <XIcon
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-8 p-1 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
                onClick={handleBorrar}
            />
        </div>
    )
}

export default ImagenFormulario;