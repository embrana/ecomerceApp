import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context); // Access store and actions from Flux context

    useEffect(() => {
        actions.getProducts(); // Fetch products on component mount
    }, []);

    return (
        <div className="text-center mt-5 d-flex justify-content-center flex-wrap flex-column align-items-center">
            <h1 className="text-center mb-4">Bienvenidos a la app de gestion del comedor!</h1>
            <p style={{ backgroundColor: '#4364dd', padding: '10px', borderRadius: '5px', width: '40%', }}>
                <img src="https://anda.com.uy/wp-content/themes/Divi-child/images/logo-anda.svg" alt="Logo" />
            </p>

        </div>
    );
};
