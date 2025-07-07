import { Link } from "react-router";
import { useAuth } from "@/context/AuthProvider";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "./ui/button";
import { ModeToggle } from "./ThemeToggle";


export default function Navbar() {
    const { usuario, cerrarSesion } = useAuth()!;

    return (
        <NavigationMenu className="mx-auto">
            <NavigationMenuList className="px-8 py-2">
                <div className="flex">
                    <NavigationMenuItem>
                        <Link to="/">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Inicio
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    {
                        usuario && (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Publicar</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                                            <Link to="/publicar-perdido" className={buttonVariants({ variant: "ghost" })}>
                                                Publicar perdido
                                            </Link>
                                            <Link to="/publicar-encontrado" className={buttonVariants({ variant: "ghost" })}>
                                                Publicar encontrado
                                            </Link>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Buscar</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                                            <Link to="/buscar-perdidos" className={buttonVariants({ variant: "ghost" })}>
                                                Buscar perdidos
                                            </Link>
                                            <Link to="/buscar-encontrados" className={buttonVariants({ variant: "ghost" })}>
                                                Buscar encontrados
                                            </Link>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to="/tu-zona">
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Tu Zona
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </>
                        )
                    }
                </div>
                {
                    usuario ? (
                        usuario?.photoURL && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex-shrink-0 outline-none">
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
                <NavigationMenuItem>
                    <div className="ml-4">
                        <ModeToggle />
                    </div>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}