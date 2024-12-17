import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";



import { Home } from "./pages/home";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";

import Login from "./pages/login";
import DashboardCocina from "./pages/dashboardCocina";
import AddMenu from "./pages/addMenu";
import EditMenu from "./pages/editMenu";
import Menu from "./pages/menu";
import Reserve from "./pages/reserve";

import { CheckOut } from "./pages/checkout";

import ProtectedRoute from "./component/protectedRoute";
import Cart from "./component/cart";

//create your first component
const Layout = () => {
    //the basename is usedwhen your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/home" />
                        <Route element={<Login />} path="/login" />
                        <Route path="/menu" element={
                            <ProtectedRoute>
                                <Menu />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/cocina" element={
                            <ProtectedRoute>
                                <DashboardCocina />
                            </ProtectedRoute>
                        } />
                        <Route path="/add/menu" element={
                            <ProtectedRoute>
                                <AddMenu />
                            </ProtectedRoute>
                        } />
                        <Route path="/edit/menu" element={
                            <ProtectedRoute>
                                <EditMenu />
                            </ProtectedRoute>
                        } />
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        } />
                        <Route path="/reserve" element={
                            <ProtectedRoute>
                                <Reserve />
                            </ProtectedRoute>
                        } />
                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckOut />
                            </ProtectedRoute>
                        } />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    ); 
    
};

export default injectContext(Layout);
