// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

import { PublicacionPerdidoDB, PublicacionPerdidoForm } from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function obtenerPublicacionesPerdidos(){
    let publicaciones: PublicacionPerdidoDB[] = [];

    try{
        const q = query(collection(db, "perdidos"), orderBy("fecha"));
        const docs = await getDocs(q);

        publicaciones = docs.docs.map(doc => doc.data() as PublicacionPerdidoDB);
    } catch(error){
        console.error("Error al obtener las publicaciones de perros perdidos", error);
    }

    return publicaciones;
}

export async function obtenerPublicacionesEncontrados(){

}

export async function obtenerPublicacionPerdido(id: string){
    const docRef = doc(db, "perdidos", id);
    const documento = await getDoc(docRef);

    return documento.data() as PublicacionPerdidoDB;
}

export async function obtenerPublicacionEncontrado(){

}

export async function crearPublicacionPerdido(datos: PublicacionPerdidoForm & { idCreador: string, nombreCreador: string }){
    let nuevaPublicacion: PublicacionPerdidoDB = {
        id: Date.now() + datos.idCreador,
        fecha: Date.now(),
        idCreador: datos.idCreador,
        nombreCreador: datos.nombreCreador,

        nombre: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion,
        fotos: []
    }

    // Subir las fotos de la publicación
    if(datos.fotos.length > 0){
        try{
            let fotos = [...datos.fotos].map(async fileFoto => {
                let srcRef = `perdidos/${nuevaPublicacion.id}/${nuevaPublicacion.fecha}-${fileFoto.name}`;

                // Subir cada foto
                const storageRef = ref(storage, srcRef);
                await uploadBytes(storageRef, fileFoto);

                return await getDownloadURL(ref(storage, srcRef));
            })

            nuevaPublicacion.fotos = await Promise.all(fotos) as string[];
        } catch(error){
            // Error al subir la foto
            console.error(error);
        }
    }

    try{
        // Crear un documento en la colección de perdidos
        await setDoc(doc(db, "perdidos", nuevaPublicacion.id), nuevaPublicacion);
    
        return nuevaPublicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}

export async function borrarPublicacion(idPublicacion: string, coleccion: string){
    // Borrar publicación
    try{
        await deleteDoc(doc(db, coleccion, idPublicacion));
    } catch(error){
        console.error("Error al borrar la publicación", error);
    }

    // Borrar imágenes
    try{
        const listResult = await listAll(ref(storage, `${coleccion}/${idPublicacion}`));

        const promesas = [...listResult.items].map(async item => {
            await deleteObject(item);
        })

        await Promise.all(promesas);
    } catch(error){
        console.error("Error al borrar las imágenes de la publicación", error);
    }
}