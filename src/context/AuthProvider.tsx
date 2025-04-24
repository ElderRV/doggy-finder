import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, UserCredential } from "firebase/auth";
import { useNavigate } from "react-router";

import { AuthProviderValue, AuthUser, AuthUserDB, Roles } from "@/types";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ERRORES_FIREBASE, PERMISOS } from "@/lib/utils";
import { FirebaseError } from "firebase/app";

const provider = new GoogleAuthProvider();

const authContext = createContext<AuthProviderValue | null>(null);

export function useAuth() {
    return useContext(authContext);
}

type Permisos = {
    [K in Roles]: {
        [key: string]: boolean;
    };
} | undefined;

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<AuthUser>(undefined);
    const [permisos, setPermisos] = useState<Permisos>(undefined);
    const navigate = useNavigate();

    // Actualizar el estado de la sesión en tiempo real
    useEffect(() => {
        //TODO: Obtener los permisos del usuario desde la base de datos
        setPermisos(PERMISOS);

        onAuthStateChanged(auth, async usuario => {
            if (usuario) {
                // Obtener los datos extras del usuario de la base de datos
                const documento = doc(db, "usuarios", usuario?.uid);
                const snapshot = await getDoc(documento);
                const datos = snapshot.data() as AuthUserDB;

                setUsuario({
                    ...datos,
                    ...usuario,
                });
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
        let usuario: UserCredential;
        try{
            usuario = await createUserWithEmailAndPassword(auth, email, password);
        } catch(error){
            if(error instanceof FirebaseError){
                const errorCode = error?.code;
                const mensajeError = ERRORES_FIREBASE.AUTH[errorCode] || "Ocurrió un error al iniciar sesión";
                throw new Error(mensajeError);
            }
            throw new Error("Ocurrió un error al iniciar sesión");
        }

        // Se actualiza el perfil del usuario con el nombre
        await updateProfile(auth.currentUser!, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
        });

        // Se crea un usuario en la base de datos
        const documento = doc(db, "usuarios", usuario?.user?.uid);
        await setDoc(documento, {
            id: usuario?.user?.uid,
            nombre: name,
            email: email,
            rol: "usuario"
        });
    }

    const iniciarSesion = async ({ email, password }: { email: string, password: string }): Promise<any> => {
        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch(error){
            if(error instanceof FirebaseError){
                const errorCode = error?.code;
                const mensajeError = ERRORES_FIREBASE.AUTH[errorCode] || "Ocurrió un error al iniciar sesión";
                throw new Error(mensajeError);
            }
            throw new Error("Ocurrió un error al iniciar sesión");
        }
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
            permisos,
            iniciarSesionGoogle,
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            enviarCorreoRecuperacion
        }}>{children}</authContext.Provider>
    );
}

export default AuthProvider;
