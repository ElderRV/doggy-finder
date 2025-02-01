import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "@/components/Navbar";

import Inicio from "@/pages/Inicio";

import FormularioPerdido from "./pages/FormularioPerdido";
import BuscarPerdidos from "./pages/BuscarPerdidos";
import DescripcionPerdido from "./pages/DescripcionPerdido";

import FormularioEncontrado from "./pages/FormularioEncontrado";
import BuscarEncontrados from "./pages/BuscarEncontrados";
import DescripcionEncontrado from "./pages/DescripcionEncontrado";

import Registro from "@/pages/Registro";
import InicioSesion from "@/pages/InicioSesion";

function App(){
    return(
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <ScrollToTop>
                        <Navbar />
                        <Toaster />
                        <Routes>
                            <Route path="/" element={<Inicio />} />

                            <Route path="/publicar-perdido" element={<FormularioPerdido />} />
                            <Route path="/editar-perdido/:id" element={<FormularioPerdido />} />
                            <Route path="/buscar-perdidos" element={<BuscarPerdidos />} />
                            <Route path="/buscar-perdidos/:id" element={<DescripcionPerdido />} />

                            <Route path="/publicar-encontrado" element={<FormularioEncontrado />} />
                            <Route path="/editar-encontrado/:id" element={<FormularioEncontrado />} />
                            <Route path="/buscar-encontrados" element={<BuscarEncontrados />} />
                            <Route path="/buscar-encontrados/:id" element={<DescripcionEncontrado />} />
                            
                            <Route path="/registro" element={<Registro />} />
                            <Route path="/inicio-sesion" element={<InicioSesion />} />
                        </Routes>
                    </ScrollToTop>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App;