import { Link } from "react-router";
import { useAuth } from "@/context/AuthProvider";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
  

export default function Navbar() {
    const { usuario, cerrarSesion } = useAuth()!;

    return (
        <NavigationMenu className="max-w-full">
            <NavigationMenuList className="w-screen px-8 py-2">
                <NavigationMenuItem className="mr-auto">
                    <Link to="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Inicio
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {
                    usuario ? (
                        usuario?.photoURL && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <img className="size-8 rounded-full" src={usuario.photoURL} alt={`Imagen de perfil de ${usuario?.displayName}`} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem className="cursor-pointer" onClick={cerrarSesion}>Cerrar sesión</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    ) : (
                        <>
                            <NavigationMenuItem>
                                <Link to="/registro">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Registro
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/inicio-sesion">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Iniciar sesión
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </>
                    )
                }
            </NavigationMenuList>
        </NavigationMenu>
    )
}