import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const Cart = () => {
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
<div className="container my-4">
    <div className="row border">
        <div className="col-12">
            <div className="panel panel-info mt-2">
                <div className="panel-heading">
                    <div className="panel-title">
                        <div className="row">
                            <p className="fs-5 fw-bold">
                                <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                            </p>
                        </div>
                    </div>
                </div>

                <div className="panel-body mt-2">
                    {store.cart.length > 0 ? (
                        store.cart.map((item, index) => (
                            <div className="d-flex align-items-center border-bottom py-2" key={index}>
                                {/* Imagen del producto */}
                                <div className="flex-shrink-0 me-3">
                                    <img
                                        className="img-fluid"
                                        src={item.image || "https://via.placeholder.com/150x100"}
                                        alt="Product"
                                        style={{ width: "75px", height: "50px", objectFit: "cover" }}
                                    />
                                </div>

                                {/* Nombre del producto */}
                                <div className="flex-grow-1 text-truncate me-3">
                                    <h6 className="product-name mb-0" style={{ fontSize: "0.9rem" }}>
                                        {item.name}
                                    </h6>
                                </div>

                                {/* Precio */}
                                <div className="me-3" style={{ fontSize: "0.9rem" }}>
                                    ${item.price}
                                </div>

                                {/* Selector de cantidad */}
                                <div className="d-flex align-items-center me-3">
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
                                <div>
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
                        <p className="text-muted">Your cart is empty</p>
                    )}
                </div>

                {/* Footer del carrito */}
                <div className="panel-footer mt-3">
                    <div className="row">
                        <div className="col-8">
                            <h5 className="text-end" style={{ fontSize: "1rem" }}>
                                Total: <strong>${store.cart.reduce((total, item, index) => total + item.price * (quantities[index] || 1), 0)}</strong>
                            </h5>
                        </div>
                        <div className="col-4 text-end">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => actions.setOrder()}
                            >
                                Checkout
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

export default Cart;
