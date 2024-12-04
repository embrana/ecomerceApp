import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context); // Access store and actions from Flux context

    useEffect(() => {
        actions.getProducts(); // Fetch products on component mount
    }, []);

    return (
        <div className="text-center mt-5">
            <h1>Hello Rigo!!</h1>
            <p>
                <img src={rigoImageUrl} />
            </p>
            <h2>Products</h2>
            
        </div>
    );
};
