// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

export async function obtenerPublicacionPerdido(){

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

    // TODO: Subir las fotos de la publicación
    // if(datos.fotos.length > 0){
    //     try{
    //         // Subir la foto de la publicacion
    //         // TODO: Cada foto va a tener su propia id, usar el nombre del archivo
    //         const storageRef = ref(storage, `perdidos/${nuevaPublicacion.id}`);
    //         await uploadBytes(storageRef, publicacion.fileFoto);
        
    //         nuevaPublicacion.url = await getDownloadURL(ref(storage, `perdidos/${nuevaPublicacion.id}`));
    //     } catch(error){
    //         // Error al subir la foto
    //         console.error(error);
    //     }
    // }

    //? Simular la subida de imagenes
    let promisesArray = [...datos.fotos].map(async foto => {
        const fileReader = new FileReader();
        
        return new Promise(res => {
            fileReader.onload = data => {
                const url = data.target?.result as string;

                res(url);
            }

            fileReader.readAsDataURL(foto);
        })
    })

    let fotos = await Promise.all(promisesArray) as string[];

    nuevaPublicacion.fotos = fotos;

    try{
        // Crear un documento en la colección de perdidos
        await setDoc(doc(db, "perdidos", nuevaPublicacion.id), nuevaPublicacion);
    
        return nuevaPublicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}