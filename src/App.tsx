import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import Registro from "@/pages/Registro";
import InicioSesion from "@/pages/InicioSesion";
import Inicio from "@/pages/Inicio";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";

function App(){
    return(
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Toaster />
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/inicio-sesion" element={<InicioSesion />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;