import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import ProductCO from "../component/productCO";
import "../../styles/home.css";

export const CheckOut = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts();
    }, []);

    // Categorías de productos
    const categories = [
        { type: "Menu Ejecutivo", title: "Menu Ejecutivo", color: "primary" },
        { type: "Minutas", title: "Minutas", color: "success" },
        { type: "Bebidas", title: "Bebidas", color: "info" },
    ];

    return (
                <div className="col-lg-4">
                    <ProductCO />
                </div>
    );
};

export default CheckOut;