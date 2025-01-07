import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";

import Navbar from "@/components/Navbar";
import Inicio from "@/pages/Inicio";
import FormularioPerdido from "./pages/FormularioPerdido";
import Registro from "@/pages/Registro";
import InicioSesion from "@/pages/InicioSesion";

function App(){
    return(
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Navbar />
                    <Toaster />
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/publicar-perdido" element={<FormularioPerdido />} />
                        
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/inicio-sesion" element={<InicioSesion />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App;