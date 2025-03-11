import { User } from "firebase/auth";

export interface AuthProviderValue {
    usuario: AuthUser;
    permisos: Permisos;
    iniciarSesionGoogle: () => Promise<{token: string | undefined, usuario: User} | undefined>;
    registrarUsuario: ({name: string, email: string, password: string}) => Promise<void>;
    iniciarSesion: ({email: string, password: string}) => Promise<void>;
    cerrarSesion: () => Promise<void>;
    enviarCorreoRecuperacion: (email: string) => Promise<void>;
};

export type RolesDB = "admin" | "usuario";
export type Roles = RolesDB | "anonimo";

export type AuthUserProvider = User | undefined | null;
export interface AuthUserDB {
    id: string;
    nombre: string;
    email: string | null;
    rol: Roles;
}
export type AuthUser = (AuthUserProvider & AuthUserDB) | undefined | null;

export interface PublicacionPerdidoForm {
    nombre: string;
    descripcion: string;
    telefono: string;
    direccion: Coordenadas;
}

export type PublicacionPerdidoDB = Omit<PublicacionPerdidoForm, "fotos"> & {
    id: string;
    fecha: number;
    idCreador: string;
    nombreCreador: string;
    fotos: string[];
}

export interface FotoNueva {
    id: string;
    url: string;
    file: File;
}

export type FotosNuevas = FotoNueva[];

export interface Coordenadas {
    longitud: number;
    latitud: number;
}

export type PublicacionEncontradoForm = PublicacionPerdidoForm;
export type PublicacionEncontradoDB = PublicacionPerdidoDB;

// Comentarios
export interface Comentario {
    id: string;
    idPublicacion: string;
    idUsuario: string;
    nombreUsuario: string;
    comentario: string;
    fecha: number;
}