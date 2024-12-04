import React, { useContext, useEffect } from "react";
import Card from "../component/card";
import { Context } from "../store/appContext";


export const Menu = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts();
    }, []);

    const type1Products = store.products.filter(product => product.type === "Menu Ejecutivo");
    const type2Products = store.products.filter(product => product.type === "Minutas");
    const type3Products = store.products.filter(product => product.type === "Bebidas");

    return (
        <div className="container my-5">
            <div className="mb-5">
                <h2 className="text-center text-primary mb-4">Menu Ejecutivo</h2>
                <div className="row g-4">
                    {type1Products.length > 0 ? (
                        type1Products.map((product, index) => (
                            <div className="col-md-4" key={index}>
                                <Card item={product} />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">No products available for this type</p>
                    )}
                </div>
            </div>

            <div className="mb-5">
                <h2 className="text-center text-success mb-4">Minutas</h2>
                <div className="row g-4">
                    {type2Products.length > 0 ? (
                        type2Products.map((product, index) => (
                            <div className="col-md-4" key={index}>
                                <Card item={product} />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">No products available for this type</p>
                    )}
                </div>
            </div>

            <div className="mb-5">
                <h2 className="text-center text-info mb-4">Bebidas</h2>
                <div className="row g-4">
                    {type3Products.length > 0 ? (
                        type3Products.map((product, index) => (
                            <div className="col-md-4" key={index}>
                                <Card item={product} />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">No products available for this type</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
