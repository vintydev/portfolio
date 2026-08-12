import type { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { Projects } from "./pages/Projects/Projects";
import { NotFound } from "./pages/NotFound/NotFound";

export function App(): ReactElement
{
    return (
        <BrowserRouter>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/projects" element={<Projects/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
            <Footer/>
        </BrowserRouter>
    )
}