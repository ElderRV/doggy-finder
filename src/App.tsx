import { BrowserRouter, Route, Routes } from "react-router";

import Registro from "@/pages/Registro";
import InicioSesion from "@/pages/InicioSesion";
import Inicio from "@/pages/Inicio";
import Navbar from "@/components/Navbar";

function App(){
    return(
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/inicio-sesion" element={<InicioSesion />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;