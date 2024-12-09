import React, { useContext, useEffect } from "react";
import Card from "../component/card";
import { Context } from "../store/appContext";
import Cart from "../component/cart";

export const Menu = () => {
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
        <div className="container-fluid my-5">
            <div className="row">
                {/* Sección de Productos */}
                <div className="col-lg-8">
                    {categories.map((category, idx) => {
                        const filteredProducts = store.products.filter(
                            (product) => product.type === category.type
                        );

                        return (
                            <div className="mb-5" key={idx}>
                                <h2 className={`text-center text-${category.color} mb-4`}>
                                    {category.title}
                                </h2>
                                <div className="row g-4">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product, index) => (
                                            <div className="col-sm-6 col-md-4" key={index}>
                                                <Card item={product} />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center">
                                            No products available for this category
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sección del Carrito */}
                <div className="col-lg-4">
                    <Cart />
                </div>
            </div>
        </div>
    );
};

export default Menu;
