import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/cart.css"


function toggleCheckout() {
    const checkoutSection = document.querySelector('.checkout');
    if (checkoutSection.style.display === 'block') {
        checkoutSection.style.display = 'none';
    } else {
        checkoutSection.style.display = 'block';
    }
}


const ProductCO = () => {
    const { store, actions } = useContext(Context);
    
    // Initialize quantities with default values based on the cart items
    const [quantities, setQuantities] = useState(
        store.cart.reduce((acc, item, index) => {
            acc[index] = 1; // Set a default quantity of 1
            return acc;
        }, {})
    );

    // Handle quantity change
    const handleQuantityChange = (index, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [index]: value,
        }));
    };

    // Ensure quantities are set properly when the cart updates
    useEffect(() => {
        setQuantities((prevQuantities) => {
            return store.cart.reduce((acc, item, index) => {
                if (prevQuantities[index] === undefined) {
                    acc[index] = 1; // Default to 1 if not set yet
                }
                return acc;
            }, prevQuantities);
        });
    }, [store.cart]);

    return (
        
<div className="container my-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
    <div className="row border">
        <div className="col-12">
            <div className="panel panel-info mt-2">
                <div className="panel-heading">
                    <div className="panel-title text-center">
                        <p className="fs-5 fw-bold">
                            <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                        </p>
                    </div>
                </div>

                <div className="panel-body mt-2">
                    {store.cart.length > 0 ? (
                        store.cart.map((item, index) => (
                            <div
                                className="d-flex align-items-center border-bottom py-2"
                                key={index}
                                style={{ fontSize: "0.9rem" }}
                            >
                                {/* Imagen del producto */}
                                <div className="flex-shrink-0" style={{ width: "60px" }}>
                                    <img
                                        className="img-fluid"
                                        src={item.image || "https://via.placeholder.com/150x100"}
                                        alt="Product"
                                        style={{
                                            width: "60px",
                                            height: "40px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>

                                {/* Nombre y precio del producto */}
                                <div className="flex-grow-1 ms-2">
                                    <h6 className="mb-1 text-truncate">{item.name}</h6>
                                    <p className="mb-0 text-muted">${item.price}</p>
                                </div>

                                {/* Selector de cantidad */}
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() =>
                                            handleQuantityChange(index, Math.max(1, (quantities[index] || 1) - 1))
                                        }
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm text-center mx-1"
                                        value={quantities[index] || 1}
                                        onChange={(e) =>
                                            handleQuantityChange(index, Math.max(1, Number(e.target.value)))
                                        }
                                        min="1"
                                        style={{ width: "50px" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() =>
                                            handleQuantityChange(index, (quantities[index] || 1) + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Botón para eliminar */}
                                <div className="ms-2">
                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm text-danger"
                                        onClick={() => actions.removeFromCart(index)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">Your cart is empty</p>
                    )}
                </div>

                {/* Footer del carrito */}
                <div className="panel-footer mt-3">
                    <div className="row align-items-center">
                        <div className="col-6 text-start">
                            <h5 style={{ fontSize: "1rem" }}>
                                Total: <strong>${store.cart.reduce((total, item, index) => total + item.price * (quantities[index] || 1), 0)}</strong>
                            </h5>
                        </div>
                        <div className="col-6 text-end">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => actions.setOrder()}
                            >
                                Pagar en Efectivo
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => actions.setOrder()}
                            >
                                Mercado Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    );
};

export default ProductCO;

