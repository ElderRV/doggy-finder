import { XIcon } from "lucide-react";

interface ImagenFormularioProps {
    key: string | number;
    src: string;
    handleBorrar: any;
}

function ImagenFormulario({ key, src, handleBorrar }: ImagenFormularioProps){
    return(
        <div className="relative" key={key}>
            <img className="size-full object-cover" src={src} />
            <XIcon
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-8 p-1 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
                onClick={handleBorrar}
            />
        </div>
    )
}

export default ImagenFormulario;