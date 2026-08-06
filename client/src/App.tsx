import type { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { Projects } from "./pages/Projects/Projects";

export function App(): ReactElement
{
    return (
        <BrowserRouter>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/projects" element={<Projects/>}/>
                </Routes>
            </main>
            <Footer/>
        </BrowserRouter>
    )
}