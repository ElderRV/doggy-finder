import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router";

import { AuthProviderValue, AuthUser } from "@/types";
import { auth } from "@/firebase";

const provider = new GoogleAuthProvider();

const authContext = createContext<AuthProviderValue | null>(null);

export function useAuth() {
    return useContext(authContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<AuthUser>(undefined);
    const navigate = useNavigate();

    // Actualizar el estado de la sesión en tiempo real
    useEffect(() => {
        onAuthStateChanged(auth, usuario => {
            if (usuario) {
                setUsuario(usuario);
            } else {
                setUsuario(null);
            }
        });
    }, []);

    const iniciarSesionGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const usuario = result.user;

            return {
                token,
                usuario,
            };
        } catch (error: any) {
            const errorCode = error?.code;
            const errorMessage = error?.message;
            // The email of the user's account used.
            const email = error?.customData?.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log({ errorCode, errorMessage, email, credential });
        }
    }

    const registrarUsuario = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<any> => {
        // Se registra al usuario y se regresan los datos de la cuenta
        await createUserWithEmailAndPassword(auth, email, password);

        // Se actualiza el perfil del usuario con el nombre
        await updateProfile(auth.currentUser!, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
        });
    }

    const iniciarSesion = async ({ email, password }: { email: string, password: string }): Promise<any> => {
        await signInWithEmailAndPassword(auth, email, password);
    }

    const cerrarSesion = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (e) {
            console.log(e);
        }
    }

    const enviarCorreoRecuperacion = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }

    return (
        <authContext.Provider value={{
            usuario,
            iniciarSesionGoogle,
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            enviarCorreoRecuperacion
        }}>{children}</authContext.Provider>
    );
}

export default AuthProvider;
