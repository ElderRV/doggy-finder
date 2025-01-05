import { User } from "firebase/auth";

export interface AuthProviderValue {
    usuario: AuthUser;
    iniciarSesionGoogle: () => Promise<{token: string | undefined, usuario: User} | undefined>;
    registrarUsuario: ({name: string, email: string, password: string}) => Promise<void>;
    iniciarSesion: ({email: string, password: string}) => Promise<void>;
    cerrarSesion: () => Promise<void>;
};

export type AuthUser = User | undefined | null;