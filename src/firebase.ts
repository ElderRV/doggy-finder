// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

import { Comentario, PublicacionEncontradoDB, PublicacionEncontradoForm, PublicacionPerdidoDB, PublicacionPerdidoForm } from "./types";

import { incluyePerro, obtenerRaza } from "./lib/utils";

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

// Globales
export async function obtenerPublicaciones<T>(coleccion: string){
    let publicaciones: T[] = [];

    try{
        const q = query(collection(db, coleccion), orderBy("fecha", "desc"));
        const docs = await getDocs(q);

        publicaciones = docs.docs.map(doc => doc.data() as T);
    } catch(error){
        console.error(`Error al obtener las publicaciones de perros ${coleccion}`, error);
    }

    return publicaciones;
}

export async function obtenerPublicacion<T>(coleccion: string, id: string){
    const docRef = doc(db, coleccion, id);
    const documento = await getDoc(docRef);

    return documento.data() as T;
}

export async function borrarPublicacion(coleccion: string, idPublicacion: string){
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

    // Borrar comentarios
    try{
        const q = query(collection(db, "comentarios"), where("idPublicacion", "==", idPublicacion));
        const querySnapshot = await getDocs(q);

        const promesas = querySnapshot.docs.map(async doc => {
            await deleteDoc(doc.ref);
        })

        await Promise.all(promesas);
    } catch(error){
        console.error("Error al borrar los comentarios de la publicación", error);
    }
}

// Perdidos
export async function obtenerPublicacionesPerdidos(){
    return await obtenerPublicaciones<PublicacionPerdidoDB>("perdidos");
}

export async function obtenerPublicacionPerdido(id: string){
    return await obtenerPublicacion<PublicacionPerdidoDB>("perdidos", id);
}

export async function crearPublicacionPerdido(datos: PublicacionPerdidoForm & { idCreador: string, nombreCreador: string, fotos: File[] }){
    let nuevaPublicacion: PublicacionPerdidoDB = {
        id: Date.now() + datos.idCreador,
        fecha: Date.now(),
        idCreador: datos.idCreador,
        nombreCreador: datos.nombreCreador,

        nombre: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion,
        fotos: [],
        raza: ""
    }

    if(datos.fotos.length <= 0) throw new Error("No se ha subido ninguna foto");
    
    // Subir las fotos de la publicación
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

    // Si no se subió ninguna foto, no se crea la publicación
    if(nuevaPublicacion.fotos.length <= 0) throw new Error("Hubo un error al subir las fotos");

    // Verificar si las fotos contienen perros, si no, eliminar las que no
    // Se tiene que hacer después de subirlas porque la API de reconocimiento de perros no acepta Files
    try{
        const fotos = await incluyePerro(nuevaPublicacion.fotos);

        const fotosValidas = fotos.filter(foto => foto.includes_dog).map(foto => foto.url);
        if(fotosValidas.length <= 0) throw new Error("Las fotos no contienen perros");

        // Sobreescribir las fotos válidas
        nuevaPublicacion.fotos = fotosValidas;

        // Borrar las fotos que no contienen perros
        const fotosBorrar = fotos.filter(foto => !foto.includes_dog).map(foto => foto.url);
        fotosBorrar.forEach(foto => {
            deleteObject(ref(storage, foto));
        })
    } catch(error){
        console.error("Error al detectar perros en las imágenes", error);
        if(error instanceof Error) throw new Error(error.message);
    }

    // Se obtiene la raza de las fotos subidas
    const raza = await obtenerRaza(nuevaPublicacion.fotos);
    nuevaPublicacion.raza = raza;

    try{
        // Crear un documento en la colección de perdidos
        await setDoc(doc(db, "perdidos", nuevaPublicacion.id), nuevaPublicacion);
    
        return nuevaPublicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}

export async function editarPublicacionPerdido(id: string, datos: PublicacionPerdidoForm & { fotosDB: {url: string, borrar: boolean}[], fotos: File[] }){
    let publicacion = await obtenerPublicacionPerdido(id);
    if(!publicacion) return;

    // Se sobreescriben los campos
    publicacion = {
        ...publicacion,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion
    }

    // Borrar fotos que ya están en la base de datos y fueron marcadas para borrar
    try{
        const fotosBorrar = datos.fotosDB.filter(foto => foto.borrar);
        fotosBorrar.forEach(foto => {
            deleteObject(ref(storage, foto.url));
        })
    } catch(error){
        console.error(error);
    }

    // Subir las fotos nuevas
    if(datos.fotos.length > 0){
        try{
            let fotos = [...datos.fotos].map(async fileFoto => {
                let srcRef = `perdidos/${id}/${publicacion.fecha}-${fileFoto.name}`;

                // Subir cada foto
                const storageRef = ref(storage, srcRef);
                await uploadBytes(storageRef, fileFoto);

                return await getDownloadURL(ref(storage, srcRef));
            })

            const fotosAnteriores = datos.fotosDB.filter(foto => !foto.borrar).map(foto => foto.url);
            const nuevasFotos = await Promise.all(fotos) as string[];
            publicacion.fotos = [...fotosAnteriores, ...nuevasFotos];
        } catch(error){
            // Error al subir la foto
            console.error(error);
        }
    }

    try{
        // Editar el documento
        await updateDoc(doc(db, "perdidos", id), publicacion);
    
        return publicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}

export async function borrarPublicacionPerdido(id: string){
    return await borrarPublicacion("perdidos", id);
}

// Encontrados
export async function obtenerPublicacionesEncontrados(){
    return await obtenerPublicaciones<PublicacionEncontradoDB>("encontrados");
}

export async function obtenerPublicacionEncontrado(id: string){
    return await obtenerPublicacion<PublicacionEncontradoDB>("encontrados", id);
}

export async function crearPublicacionEncontrado(datos: PublicacionEncontradoForm & { idCreador: string, nombreCreador: string, fotos: File[] }){
    let nuevaPublicacion: PublicacionEncontradoDB = {
        id: Date.now() + datos.idCreador,
        fecha: Date.now(),
        idCreador: datos.idCreador,
        nombreCreador: datos.nombreCreador,

        nombre: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion,
        fotos: [],
        raza: ""
    }
    
    if(datos.fotos.length <= 0) throw new Error("No se ha subido ninguna foto");

    // Subir las fotos de la publicación
    try{    
        let fotos = [...datos.fotos].map(async fileFoto => {
            let srcRef = `encontrados/${nuevaPublicacion.id}/${nuevaPublicacion.fecha}-${fileFoto.name}`;

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

    // Si no se subió ninguna foto, no se crea la publicación
    if(nuevaPublicacion.fotos.length <= 0) throw new Error("Hubo un error al subir las fotos");

    // Verificar si las fotos contienen perros, si no, eliminar las que no
    // Se tiene que hacer después de subirlas porque la API de reconocimiento de perros no acepta Files
    try{
        const fotos = await incluyePerro(nuevaPublicacion.fotos);

        const fotosValidas = fotos.filter(foto => foto.includes_dog).map(foto => foto.url);
        if(fotosValidas.length <= 0) throw new Error("Las fotos no contienen perros");

        // Sobreescribir las fotos válidas
        nuevaPublicacion.fotos = fotosValidas;

        // Borrar las fotos que no contienen perros
        const fotosBorrar = fotos.filter(foto => !foto.includes_dog).map(foto => foto.url);
        fotosBorrar.forEach(foto => {
            deleteObject(ref(storage, foto));
        })
    } catch(error){
        console.error("Error al detectar perros en las imágenes", error);
        if(error instanceof Error) throw new Error(error.message);
    }

    // Se obtiene la raza de las fotos subidas
    const raza = await obtenerRaza(nuevaPublicacion.fotos);
    nuevaPublicacion.raza = raza;

    try{
        // Crear un documento en la colección de encontrados
        await setDoc(doc(db, "encontrados", nuevaPublicacion.id), nuevaPublicacion);
    
        return nuevaPublicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}

export async function editarPublicacionEncontrado(id: string, datos: PublicacionEncontradoForm & { fotosDB: {url: string, borrar: boolean}[], fotos: File[] }){
    let publicacion = await obtenerPublicacionEncontrado(id);
    if(!publicacion) return;

    // Se sobreescriben los campos
    publicacion = {
        ...publicacion,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion
    }

    // Borrar fotos que ya están en la base de datos y fueron marcadas para borrar
    try{
        const fotosBorrar = datos.fotosDB.filter(foto => foto.borrar);
        fotosBorrar.forEach(foto => {
            deleteObject(ref(storage, foto.url));
        })
    } catch(error){
        console.error(error);
    }

    // Subir las fotos nuevas
    if(datos.fotos.length > 0){
        try{
            let fotos = [...datos.fotos].map(async fileFoto => {
                let srcRef = `encontrados/${id}/${publicacion.fecha}-${fileFoto.name}`;

                // Subir cada foto
                const storageRef = ref(storage, srcRef);
                await uploadBytes(storageRef, fileFoto);

                return await getDownloadURL(ref(storage, srcRef));
            })

            const fotosAnteriores = datos.fotosDB.filter(foto => !foto.borrar).map(foto => foto.url);
            const nuevasFotos = await Promise.all(fotos) as string[];
            publicacion.fotos = [...fotosAnteriores, ...nuevasFotos];
        } catch(error){
            // Error al subir la foto
            console.error(error);
        }
    }

    try{
        // Editar el documento
        await updateDoc(doc(db, "encontrados", id), publicacion);
    
        return publicacion;
    } catch(error){
        // Error al subir el documento de la publicación
        console.error(error);
    }
}

export async function borrarPublicacionEncontrado(id: string){
    return await borrarPublicacion("encontrados", id);
}

// Comentarios
export async function obtenerComentarios(idPublicacion: string){
    let comentarios: Comentario[] = [];

    try{
        const q = query(collection(db, "comentarios"), where("idPublicacion", "==", idPublicacion), orderBy("fecha"));
        const querySnapshot = await getDocs(q);

        comentarios = querySnapshot.docs.map(doc => doc.data() as Comentario);
    } catch(error){
        console.error("Error al obtener los comentarios", error);
    }

    return comentarios;
}

export async function obtenerComentario(id: string){
    const docRef = doc(db, "comentarios", id);
    const documento = await getDoc(docRef);

    return documento.data() as Comentario;
}

export async function enviarComentario({ idPublicacion, idUsuario, nombreUsuario, comentario }: { idPublicacion: string, idUsuario: string, nombreUsuario: string, comentario: string }){
    const id = `${idPublicacion}-${idUsuario}-${Date.now()}`;
    const nuevoComentario: Comentario = {
        id,
        idPublicacion,
        idUsuario,
        nombreUsuario,
        comentario,
        fecha: Date.now(),
    }

    try{
        await setDoc(doc(db, "comentarios", id), nuevoComentario);
        
        return nuevoComentario;
    } catch(error){
        console.error("Error al enviar el comentario", error);
    }
}

export async function borrarComentario(idComentario: string){
    try{
        await deleteDoc(doc(db, "comentarios", idComentario));
    } catch(error){
        console.error("Error al borrar el comentario", error);
    }
}

// Perros similares
export async function buscarPerrosSimilares(tipo: string, raza: string){
    let publicaciones: PublicacionEncontradoDB[] | PublicacionPerdidoDB[] = [];

    // Si un perro fue perdido, se busca en la colección de encontrados y viceversa
    const tipoPublicacion = tipo === "perdido" ? "encontrados" : "perdidos";

    try{
        const q = query(collection(db, tipoPublicacion), where("raza", "==", raza), orderBy("fecha", "desc"));
        const docs = await getDocs(q);

        publicaciones = docs.docs.map(doc => doc.data() as PublicacionEncontradoDB | PublicacionPerdidoDB);
    } catch(error){
        console.error(`Error al obtener las publicaciones de perros ${tipo}`, error);
    }

    return publicaciones;
}