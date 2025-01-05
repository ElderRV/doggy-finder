import { Link } from "react-router";
import { useAuth } from "@/context/AuthProvider";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
    const { usuario, cerrarSesion } = useAuth()!;

    return (
        <NavigationMenu className="mx-auto">
            <NavigationMenuList>
                <NavigationMenuItem className="mr-auto">
                    <Link to="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Inicio
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {
                    usuario ? (
                        <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                <button onClick={cerrarSesion}>
                                    Cerrar sesión
                                </button>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
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