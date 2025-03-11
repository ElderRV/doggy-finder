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
import Protegido from "./components/Protegido";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <ScrollToTop>
                        <Navbar />
                        <Toaster />
                        <Routes>
                            <Route path="/" element={<Inicio />} />

                            <Route path="/publicar-perdido" element={
                                <Protegido
                                    names={["general/crear-publicacion"]}
                                    type="route"
                                    redirect="/"
                                >
                                    <FormularioPerdido />
                                </Protegido>
                            } />
                            <Route path="/editar-perdido/:id" element={
                                <Protegido
                                    names={["general/administrar-publicacion", "personal:publicacion/administrar-publicacion"]}
                                    type="route"
                                    redirect="/"
                                    paramURL="id"
                                    params={{ coleccion: "perdidos" }}
                                >
                                    <FormularioPerdido />
                                </Protegido>}
                            />
                            <Route path="/buscar-perdidos" element={<BuscarPerdidos />} />
                            <Route path="/buscar-perdidos/:id" element={<DescripcionPerdido />} />

                            <Route path="/publicar-encontrado" element={
                                <Protegido
                                    names={["general/crear-publicacion"]}
                                    type="route"
                                    redirect="/"
                                >
                                    <FormularioEncontrado />
                                </Protegido>
                            } />
                            <Route path="/editar-encontrado/:id" element={
                                <Protegido
                                    names={["general/administrar-publicacion", "personal:publicacion/administrar-publicacion"]}
                                    type="route"
                                    redirect="/"
                                    paramURL="id"
                                    params={{ coleccion: "encontrados" }}
                                >
                                    <FormularioEncontrado />
                                </Protegido>}
                            />
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